import { defineEventHandler, getRouterParam, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { deleteUser } from '../../dal/TLB.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 ID' })
  }

  const success = deleteUser(id)
  if (!success) {
    throw createError({ statusCode: 404, statusMessage: '找不到使用者' })
  }

  return {
    success: true,
    message: `ID:'${id}' 刪除完畢`,
    affectedRows: 1,
  };
})
