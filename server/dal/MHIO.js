import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { compareObjectsByKeys } from './_helper.js'

import db from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Day.js
---------+---------+---------+---------+---------+---------+---------+--------*/

dayjs.extend(utc)
dayjs.extend(timezone)

// 預設用台北時區
dayjs.tz.setDefault("Asia/Taipei")

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {*} MHIO 
 * @param {*} R3 (會故意補一個TDate)
 * @returns 
 */
function PK01(MHIO, R3) {
  const keys = [
    'TDate', 'OrderNo', 'MthPr', 'ExCd', 'BuySell', 'IVAcNo', 'OdrTpe', 'BrokerId'
  ]
  return compareObjectsByKeys(MHIO, R3, keys)
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {object} input 
 * @param {Number} input.page 
 * @param {Number} input.size 
 * @param {String} input.sortField 
 * @param {String} input.sortDir asc/dsc
 * @returns 
 */
export function ReadMHIO(input) {
  const { page, size, sortField, sortDir } = input;

  db.read()
  let MHIO = db.data.MHIO;

  // 按日期篩選
  const transactionDate = new Date();
  MHIO = MHIO.filter((rec) => {
    const TDate = new Date(rec.TDate)
    return (
      TDate.getFullYear() === transactionDate.getFullYear() &&
      TDate.getMonth()    === transactionDate.getMonth() &&
      TDate.getDate()     === transactionDate.getDate()
    );
  })

  // 排序
  MHIO = MHIO.sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  // 分頁
  const start = (page - 1) * size
  const end = start + size
  const paginated = MHIO.slice(start, end)
  const lastPage = Math.ceil(MHIO.length / size)

  return {
    data: paginated,
    last_page: lastPage
  }
}

/**
 * 處理價格並單用
 * @param {*} R3 
 * @returns affected rows
 */
export function ReWriteMHIO(R3) {
  const {
    OrderNo, StkNo, MthQty, MthPr, ExCd, BuySell, IVAcNo, OdrTpe, BrokerId
  } = R3;

  const transactionDate = dayjs().startOf('D').toDate()

  db.read()

  // 查詢是否有同價位的MHIO
  const MHIO = db.data.MHIO.find((MHIO) => PK01(MHIO, { TDate: transactionDate, ...R3 }))
  
  if (MHIO) {
    MHIO.MthQty += MthQty;
  } else {
    const MHIO = {
      TDate: transactionDate,
      OrderNo, StkNo, MthQty, MthPr, ExCd, BuySell, IVAcNo, OdrTpe, BrokerId
    }

    db.data.MHIO.push(MHIO)
  }

  db.write()
  
  return 1;
}