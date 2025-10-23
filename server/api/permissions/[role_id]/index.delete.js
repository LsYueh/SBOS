import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { del } from '../../../dal/permissions.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const role_id = getRouterParam(event, 'role_id');
  const body = await readBody(event);

  const { resource_id } = body;

  if (!role_id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 role_id' })
  }

  if (!resource_id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 resource_id' })
  }

  throw createError({ statusCode: 501, statusMessage: 'Not implemented' });
})
