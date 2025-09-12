import db from '../utils/db.js'

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
    const MthTime = new Date(rec.MthTime)
    return (
      MthTime.getFullYear() === transactionDate.getFullYear() &&
      MthTime.getMonth()    === transactionDate.getMonth() &&
      MthTime.getDate()     === transactionDate.getDate()
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
 * @param {*} R3 
 * @returns affected rows
 */
export function WriteMHIO(R3) {
  // TODO: 分單處理
  
  return 0;
}

/**
 * 處理並單用
 * @param {*} R3 
 * @returns affected rows
 */
export function ReWriteMHIO(R3) {
  // TODO: 分單處理
  
  return 0;
}