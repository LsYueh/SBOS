import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { enableUser, disableUser } from '../../../dal/users.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 id' })
  }

  if (!body.status) {
    throw createError({ statusCode: 400, statusMessage: '缺少狀態' })
  }

  const res = (body.status.toUpperCase() === 'Y') ? await enableUser(id, body) : await disableUser(id, body)
  if (!res) {
    throw createError({ statusCode: 404, statusMessage: '找不到使用者' })
  }

  return res
})