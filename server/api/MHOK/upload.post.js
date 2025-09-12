import { defineEventHandler } from 'h3'
import fs from 'fs'

import formidable from 'formidable'
import PQueue from 'p-queue';

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { copybook } from 'templar'

import { Decoder } from '../../utils/decoder'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { WriteMHOK } from '../../dal/MHOK'
import { ReWriteMHIO } from '../../dal/MHIO'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** PQueue */
const queue = new PQueue({concurrency: 1})

/** Timezone */
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Taipei')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 檢查日期格式後建構 dayjs 物件
 * @param {string} dateStr - 日期字串，僅允許 YYYY-MM-DD
 * @returns {dayjs.Dayjs} dayjs 物件
 * @throws {Error} 日期格式錯誤或不存在
 */
function createDateFromString(dateStr) {
  // 僅允許 YYYY-MM-DD
  const re = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(re);
  if (!match) {
    throw new Error("日期格式錯誤，請使用 YYYY-MM-DD");
  }

  const date = dayjs(dateStr, 'YYYY-MM-DD', true); // strict 模式

  if (!date.isValid()) {
    throw new Error("日期不存在");
  }

  return date;
}

/**
 * @param {Date} targetDate 
 * @param {dayjs.Dayjs} sourceDate 
 * @returns 
 */
function overwriteYMD(targetDate, sourceDate) {
  targetDate.setFullYear(
    sourceDate.year(),
    sourceDate.month(), // 0-base 與 Date 一致
    sourceDate.date()   // 1-base
  );
  return targetDate;
}

/**
 * @param {object} input 
 * @param {dayjs.Dayjs} input.transactionDate 
 * @param {string} input.filePath 
 * @param {(value: any) => void} resolve 
 * @param {(value: any) => void} reject 
 */
async function processFile(input, resolve, reject) {
  const filePath = input.filePath;
  const transactionDate = input.transactionDate;

  const readStream = fs.createReadStream(filePath);

  let recCnt = 0;

  queue.on('idle', () => {
    resolve({
      success: true,
      message: `檔案日期: ${transactionDate.format('YYYY-MM-DD')} 處理完畢`,
      affectedRows: recCnt,
    })
  })

  queue.on('error', (error) => {
    reject(error)
  })

  readStream
  .pipe(new Decoder())
  .on('data', async (buffer) => {
    if (buffer.length === 66) {
      const R3 = copybook.parse(buffer, { fileCode: 'R3' });

      // 用transactionDate覆蓋R3.MthTime
      R3.MthTime = overwriteYMD(R3.MthTime, transactionDate)

      // PQueue
      await queue.add(() => {
        const affectedRows = WriteMHOK(R3); recCnt+=affectedRows;
        if (affectedRows === 1) ReWriteMHIO(R3)
      });
    }
  })
  .on('end', () => {
    // 刪除檔案
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('刪除檔案失敗:', unlinkErr)
    })
  })
  .on('error', (error) => {
    reject(error)
  })
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  /** @type {string} 上傳暫存目錄 */
  const uploadDir = './.temp';

  const form = formidable({
    uploadDir,            // 上傳暫存目錄
    keepExtensions: true, // 保留副檔名
    multiples: false      // 單檔
  })

  // 確保目錄存在
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) reject(err)

      const _t = fields.transactionDate;
      const transactionDate = createDateFromString((Array.isArray(_t) ? _t[0] : _t))

      const _f = files.file
      if (!_f) return resolve({ success: false, message: `沒有收到'${transactionDate.format('YYYY-MM-DD')}'的檔案` })
      const filePath = Array.isArray(_f) ? _f[0].filepath : _f.filepath

      await processFile({transactionDate, filePath}, resolve, reject)
    })
  })
})
