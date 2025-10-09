import { defineEventHandler, readBody, createError } from 'h3';

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { create } from '../../dal/permissions.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.key || !body.resource) {
    throw createError({ statusCode: 400, statusMessage: 'key 與 resource 必填' })
  }

  return await create(body)
})
