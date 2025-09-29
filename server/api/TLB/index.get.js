import { defineEventHandler, getQuery } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { getPagedUsers } from '../../dal/TLB.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1
  const size = Number(query.size) || 5
  const sortField = query.sortField || ''
  const sortDir = query.sortDir || ''

  return await getPagedUsers({ page, size, sortField, sortDir })
})
