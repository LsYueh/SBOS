import { defineEventHandler, getRouterParam, getQuery, readBody, createError } from 'h3';

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { updateResource, updateAction } from '../../../dal/permissions.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 id' })
  }
  
  throw createError({ statusCode: 501, statusMessage: 'Not implemented' })
})