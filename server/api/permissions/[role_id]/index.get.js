import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3';

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { getRolePermissions } from '../../../dal/permissions.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const role_id = getRouterParam(event, 'role_id');

  if (!role_id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 role_id' });
  }

  return await getRolePermissions(role_id);
})
