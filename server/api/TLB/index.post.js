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

  if (!body.username || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'username 與 name 必填' })
  }

  return await createUser(body)
})
