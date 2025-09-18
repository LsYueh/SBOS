import { defineEventHandler, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { createUser } from '../../dal/TLB.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.email) {
    throw createError({ statusCode: 400, statusMessage: 'username 與 email 必填' })
  }

  return createUser(body)
})
