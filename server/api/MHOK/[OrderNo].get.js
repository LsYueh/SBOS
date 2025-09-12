import { defineEventHandler, getQuery, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { ReadMHOKWithOrderNo } from '../../dal/MHOK'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1
  const size = Number(query.size) || 5
  const sortField = query.sortField || 'SeqNo'
  const sortDir = query.sortDir || 'asc'

  const OrderNo = event.context.params.OrderNo

  if (!OrderNo) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  return ReadMHOKWithOrderNo({ page, size, sortField, sortDir, OrderNo })
})
