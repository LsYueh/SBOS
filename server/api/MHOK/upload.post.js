import { defineEventHandler } from 'h3'
import fs from 'fs'
import { Transform } from 'stream'

import formidable from 'formidable'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Copybook
---------+---------+---------+---------+---------+---------+---------+--------*/

import { copybook } from 'templar'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Class
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @class 
 */
class Decoder extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });
    this.leftover = '';
  }

  /**
   * 
   * @param {*} chunk 
   * @param {BufferEncoding} encoding 
   * @param {*} callback 
   */
  _transform(chunk, encoding, callback) {
    const buffer = this.leftover ? Buffer.concat([this.leftover, chunk]) : chunk;
    let start = 0;

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0x0a) { // \n
        // 判斷前一個字元是不是 \r
        const end = (i > 0 && buffer[i - 1] === 0x0d) ? i - 1 : i;
        const line = buffer.slice(start, end);
        this.push(line);
        start = i + 1;
      }
    }

    this.leftover = start < buffer.length ? buffer.slice(start) : null;
    callback();
  }

  _flush(callback) {
    if (this.leftover) {
      this.push(this.leftover);
    }
    callback();
  }
}


/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 檢查日期格式後建構
 * @param {string} dateStr 
 * @returns 
 */
function createDateFromString(dateStr) {
  // 僅允許 YYYY-MM-DD
  const re = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(re);
  if (!match) {
    throw new Error("日期格式錯誤，請使用 YYYY-MM-DD");
  }

  const year  = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS 月份 0 基底
  const day   = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  // 檢查日期是否合法（例如 2025-02-30 應該無效）
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new Error("日期不存在");
  }

  return date;
}

/**
 * @param {Date} date 
 * @returns 
 */
function toLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * @param {Date} targetDate 
 * @param {Date} sourceDate 
 * @returns 
 */
function overwriteYMD(targetDate, sourceDate) {
  targetDate.setFullYear(
    sourceDate.getFullYear(),
    sourceDate.getMonth(),
    sourceDate.getDate()
  );
  return targetDate;
}

/**
 * @param {object} input 
 * @param {Date} input.transactionDate 
 * @param {string} input.filePath 
 * @param {(value: any) => void} resolve 
 * @param {(value: any) => void} reject 
 */
function processFile(input, resolve, reject) {
  const filePath = input.filePath;
  const transactionDate = input.transactionDate;

  const readStream = fs.createReadStream(filePath);
  const decoder = new Decoder()

  let recCnt = 0;

  readStream.pipe(decoder)

  decoder.on('data', (buffer) => {
    if (buffer.length === 66) {
      const R3 = copybook.parse(buffer, { fileCode: 'R3' });
      // console.log(`[${R3.OrderNo}] ${R3.StkNo.padEnd(6, ' ')} ${R3.BuySell} : ${R3.MthQty} x  ${R3.MthPr} `);

      // 用transactionDate覆蓋R3.MthTime
      R3.MthTime = overwriteYMD(R3.MthTime, transactionDate)

      // TODO: 寫入MHOK暫存

      // TODO: 寫入MHIO並分單

      recCnt++;
    }
  })

  decoder.on('end', () => {
    // 刪除檔案
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('刪除檔案失敗:', unlinkErr)
    })

    resolve({
      success: true,
      message: `檔案日期: ${toLocalISODate(transactionDate)} 處理完畢`,
      affectedRows: recCnt,
    })
  })

  decoder.on('error', (err) => {
    reject(err)
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
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)

      const _t = fields.transactionDate;
      const transactionDate = createDateFromString((Array.isArray(_t) ? _t[0] : _t))

      const _f = files.file
      if (!_f) return resolve({ success: false, message: `沒有收到'${toLocalISODate(transactionDate)}'的檔案` })
      const filePath = Array.isArray(_f) ? _f[0].filepath : _f.filepath

      processFile({transactionDate, filePath}, resolve, reject)
    })
  })
})
