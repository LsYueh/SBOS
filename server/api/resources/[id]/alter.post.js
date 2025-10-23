import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { enable, disable } from '../../../dal/resources.js'

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

  const res = (body.status.toUpperCase() === 'Y') ? await enable(id, body) : await disable(id, body)
  if (!res) {
    throw createError({ statusCode: 404, statusMessage: '找不到權限對應的資源' })
  }

  return res
})