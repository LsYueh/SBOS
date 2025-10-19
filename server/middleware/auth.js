import { defineEventHandler, createError } from 'h3';

import { checkPermission } from '../utils/checkPermission.js';

export default defineEventHandler(async (event) => {
  // const user = await getUserFromToken(event); // // TODO: 自行實作或用 session
  const user = { };

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // 取得該 API 的資源與操作
  const apiPath = event.path;
  const resource = event.node.req.url;
  const action = event.method; // GET/POST/PUT/DELETE → READ / WRITE

  // TODO: 可能要根據apiPath來確定實際的action

  // 對應使用者的權限表
  const hasPermission = await checkPermission(user.id, resource, action);

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
});
