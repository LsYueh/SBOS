import { defineEventHandler, getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {import('h3').H3Event} event 
 * @returns {string|null}
 */
function resolveAction(event) {
  // Note: 先讀 X-Sbos-User-Action，如果沒有，就 fallback HTTP method

  const action = getHeader(event, 'X-Sbos-User-Action');
  
  if (action && action.trim() !== '') {
    return action.trim();
  }
  
  const method = event.node.req.method;

  switch (method) {
    case 'GET'   : return 'read';
    case 'POST'  : return 'create';
    case 'PUT'   : return 'update';
    case 'DELETE': return 'delete';
    default      : return null; // 回傳 null → 由 checkPermission 判斷
  }
}

/**
 * 從 event 取得 resource 與 action，並檢查權限
 * @param {import('h3').H3Event} event 
 * @returns {Promise<boolean>}
 */
export async function checkPermission(event) {
  const resource = getHeader(event, 'X-Sbos-Resource-Endpoint');
  const action   = resolveAction(event);

  // Header: X-Sbos-Resource-Endpoint 必須存在
  if (!resource || resource.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required header: 'X-Sbos-Resource-Endpoint'`
    });
  }

  // 檢查 action 是否為有效字串
  if (!action || typeof action !== 'string' || action.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: `Action cannot be resolved ('X-Sbos-User-Action' missing and HTTP method unsupported)`
    });
  }

  // 排除特定資源不檢查
  const normalized = resource.trim();
  if (['/', '/dashboard'].includes(normalized)) {
    return true;
  }

  // TODO: 權限檢查
  console.log(`[ACL] Checking permission: ${normalized} -> ${action}`);

  return true;
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  // 只處理 /api/... 且排除 /api/auth (登入)
  if (!event.path.startsWith('/api')) return;
  if (event.path === '/api/auth') return;

  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig();

  // JWT check
  const authHeader = getHeader(event, 'Authorization');
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer xxx'

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    event.context.user = decoded.username;
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' });
  }

  // Permission check
  const allowed = await checkPermission(event);

  if (!allowed) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
});
