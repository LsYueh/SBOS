import { defineEventHandler, getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';

import { checkPermission } from '../../utils/checkPermission.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 驗證JWT
 * @param {import('h3').H3Event} event 
 * @returns 
 */
function verifyJwtToken(event) {
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer xxx'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return decoded.username;
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' });
  }
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const URL = event.node.req.url;
  
  // 不處理登入畫面
  if (URL === '/') return;

  // TODO: 取得username
  // const user = await verifyJwtToken(event);
  const user = { };

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // 取得該 API 的資源與操作
  const apiPath = event.path;
  const resource = URL;
  const action = event.method; // GET/POST/PUT/DELETE → READ / WRITE

  // TODO: 可能要根據apiPath來確定實際的action

  // 對應使用者的權限表
  const hasPermission = await checkPermission(user.id, resource, action);

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
});
