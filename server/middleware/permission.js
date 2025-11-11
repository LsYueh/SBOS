import { defineEventHandler, getHeader, readBody, getQuery, createError } from 'h3';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {import('h3').H3Event} event 
 * @param {any} body 
 * @param {object} query 
 * @returns 
 */
function resolveAction(event, body, query) {
  const method = event.node.req.method;

  if (body?.action) return body.action;
  if (query?.action) return query.action;

  // 預設值
  switch (method) {
    case 'GET'   : return 'read';
    case 'POST'  : return 'create';
    case 'PUT'   : return 'update';
    case 'DELETE': return 'delete';
    default: return null;
  }
}

/**
 * 檢查 URL + Action 是否允許該 user 執行。
 * @param {string} url      Resource endpoint
 * @param {string} action   read/update/delete/export/etc...
 * @param {string} userName 
 * 
 * @returns {Promise<{allow: boolean, reason?: string}>}
 */
export async function checkPermission(url, action, userName) {
  if (!action) {
    throw createError({ statusCode: 401, statusMessage: 'Action is required' });
  }

  return { allow: true };
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => { 
  // Permission check
  const url = event.path
  const body = await readBody(event).catch(() => ({}));
  const query = getQuery(event);
  const userName = event.context.user;

  const action = resolveAction(event, body, query);
  if (!action) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot determine action' });
  }

  const result = await checkPermission(url, action, userName);
});
