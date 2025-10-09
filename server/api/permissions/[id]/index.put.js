import { defineEventHandler, getRouterParam, getQuery, readBody, createError } from 'h3';

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { update } from '../../../dal/permissions.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  // const query = getQuery(event); // 看是否要分 resource 或 action
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 id' })
  }
  
  const updated = await update(id, body)
    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: '找不到權限對應的資源' })
    }
    
    return updated
})