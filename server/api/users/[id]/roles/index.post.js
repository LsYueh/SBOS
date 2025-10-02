import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // TODO: Update User Roles

  return createError({ statusCode: 501, statusMessage: 'Not Implemented' })
})
