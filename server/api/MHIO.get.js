import { defineEventHandler, getQuery } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { ReadMHIO } from '../dal/MHIO'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1
  const size = Number(query.size) || 5
  const sortField = query.sortField || 'OrderNo'
  const sortDir = query.sortDir || 'asc'

  return ReadMHIO({ page, size, sortField, sortDir });
})
