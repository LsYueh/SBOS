import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { enable, disable } from '../../../dal/permissions.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const role_id = getRouterParam(event, 'role_id')
  const body = await readBody(event);
  
  const { resource_id, status } = body;

  if (!role_id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 role_id' })
  }

  if (!resource_id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 resource_id' })
  }

  if (!status) {
    throw createError({ statusCode: 400, statusMessage: '缺少狀態' })
  }

  const res = (status.toUpperCase() === 'Y') ? await enable(role_id, resource_id, body) : await disable(role_id, resource_id, body)
  if (!res) {
    throw createError({ statusCode: 404, statusMessage: '找不到權限對應的資源' })
  }

  return res
})