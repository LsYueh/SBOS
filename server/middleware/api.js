import { defineEventHandler, getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {import('h3').H3Event} event 
 * @returns 
 */
function resolveAction(event) {
  const action = getHeader(event, 'X-Sbos-User-Action');
  
  if (action) return action;
  
  // 先讀 X-SBOS-User-Action，如果沒有，就 fallback HTTP method

  const method = event.node.req.method;

  switch (method) {
    case 'GET'   : return 'read';
    case 'POST'  : return 'create';
    case 'PUT'   : return 'update';
    case 'DELETE': return 'delete';
    default: return null;
  }
}

/**
 * 從 event 取得 resource 與 action，並檢查權限
 * @param {import('h3').H3Event} event 
 * @param {string} action 
 * @returns {Promise<boolean>}
 */
export async function checkPermission(event, action) {
  const resource = getHeader(event, 'X-Sbos-Resource-Endpoint');

  // 排除 / 與 /dashboard
  if (['/', '/dashboard'].includes(resource)) return true;

  console.log(action); // TODO: 權限檢查

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
  const action = resolveAction(event);
  if (!action) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot determine action' });
  }

  if (!await checkPermission(event, action)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
});
