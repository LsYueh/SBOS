import { defineEventHandler, getQuery } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { ReadMHOK } from '../dal/MHOK'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1
  const size = Number(query.size) || 5
  const sortField = query.sortField || 'SeqNo'
  const sortDir = query.sortDir || 'asc'

  return ReadMHOK({ page, size, sortField, sortDir });
})
