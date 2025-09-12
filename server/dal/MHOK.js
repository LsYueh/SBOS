import { compareObjectsByKeys } from './_helper.js'

import db from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * MthTime::BrokerId::RecNo
 * @param {*} MHOK 
 * @param {*} R3 
 * @returns 
 */
function PK01(MHOK, R3) {
  const keys = [
    'MthTime', 'BrokerId', 'RecNo'
  ]
  return compareObjectsByKeys(MHOK, R3, keys)
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
export function ReadMHOK(input) {
  const { page, size, sortField, sortDir } = input;

  db.read()
  let MHOK = db.data.MHOK;

  // 按日期篩選
  const transactionDate = new Date();
  MHOK = MHOK.filter((rec) => {
    const MthTime = new Date(rec.MthTime)
    return (
      MthTime.getFullYear() === transactionDate.getFullYear() &&
      MthTime.getMonth()    === transactionDate.getMonth() &&
      MthTime.getDate()     === transactionDate.getDate()
    );
  })

  // 排序
  MHOK = MHOK.sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  // 分頁
  const start = (page - 1) * size
  const end = start + size
  const paginated = MHOK.slice(start, end)
  const lastPage = Math.ceil(MHOK.length / size)

  return {
    data: paginated,
    last_page: lastPage
  }
}

/**
 * @param {*} R3 
 * @returns affected rows
 */
export function WriteMHOK(R3) {
    db.read()

    // 資料重複性檢查
    const exists = db.data.MHOK.some((MHOK) => PK01(MHOK,R3))
    if (exists) return 0;

    // Note: DB儲存UTC時間

    // 寫入MHOK
    db.data.MHOK.push(R3)
    db.write()

    return 1;
}

/**
 * @param {object} key 
 * @param {string} key.MthTime (ISO String)
 * @param {string} key.BrokerId 
 * @param {string} key.RecNo 
 * @returns affected rows
 */
export function DeleteMHOK(key) {
  db.read()

  const MHOK = db.data.MHOK.filter((MHOK) => !PK01(MHOK, key))

  // 沒有變化
  if (MHOK.length === db.data.MHOK.length) return 0
  
  db.data.MHOK = MHOK
  db.write()

  return 1;
}
