import { defineEventHandler, getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  // 只處理 /api/... 且排除 /api/auth (登入)
  if (!event.path.startsWith('/api')) return;
  if (event.path === '/api/auth') return;

  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig();

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
});
