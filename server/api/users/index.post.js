import { defineEventHandler, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { createUser } from '../../dal/users.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.account || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'account 與 name 必填' })
  }

  return await createUser(body)
})
