import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { upsertUserRoles } from '../../../../dal/user_roles.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const affectedRows = await upsertUserRoles({ user_id: id, roles: body })

  return { affectedRows }
})
