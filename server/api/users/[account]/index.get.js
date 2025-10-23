import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { getResourceInfo } from '../../../dal/users.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const account = getRouterParam(event, 'account');
  const query = getQuery(event);

  const resource = query.resource || null;

  if (!resource) {
    throw createError({ statusCode: 400, statusMessage: '缺少 resource' })
  }

  return await getResourceInfo(account, resource);
})
