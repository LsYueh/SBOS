import { defineEventHandler, getHeader, parseCookies, createError } from 'h3';
import jwt from 'jsonwebtoken';

import { checkPermission } from '../../utils/checkPermission.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {import('h3').H3Event} event 
 * @returns 
 */
function getUserFromCookie(event) {
  const cookies = parseCookies(event, 'user');

  let user = null;

  try {
    if (cookies.user) {
      user = JSON.parse(cookies.user);
    }
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Cookie 解析失敗' });
  }

  return user;
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  // 不處理 /api/...
  if (event.path.startsWith('/api')) return;
  
  // 不處理登入畫面
  if (event.node.req.url === '/') return;

  const user = getUserFromCookie(event);

  if (!user.username) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // 取得該 API 的資源與操作
  const apiPath = event.path;
  const resource = event.node.req.url;
  const action = event.method; // GET/POST/PUT/DELETE → READ / WRITE

  // TODO: 可能要根據apiPath來確定實際的action

  // 對應使用者的權限表
  const hasPermission = await checkPermission(user.username, resource, action);

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
});
