import { defineEventHandler, getHeader, createError } from 'h3';

import jwt from 'jsonwebtoken';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  const token = authHeader.split(' ')[1] // 'Bearer xxx'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    event.context.user = decoded          // 存入請求上下文，供 API 使用
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
})
