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
  const {
    page = 1, limit = 10,
    sortBy = 'OrderNo',
    order = 'asc' // asc 或 desc
  } = query

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
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })

  // 分頁
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const start = (pageNum - 1) * limitNum
  const pagedMHOK = MHOK.slice(start, start + limitNum)

  return {
    total: MHOK.length,
    page: pageNum,
    limit: limitNum,
    data: pagedMHOK
  }
})
