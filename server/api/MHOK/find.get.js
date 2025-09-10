import { defineEventHandler, getQuery, createError } from 'h3'


/**------+---------+---------+---------+---------+---------+---------+----------
 * LowDB
---------+---------+---------+---------+---------+---------+---------+--------*/

import db from '../../utils/db.js'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1
  const size = Number(query.size) || 5
  const sortField = query.sortField || ''
  const sortDir = query.sortDir || ''

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
})
