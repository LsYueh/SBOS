import { defineEventHandler, readBody, createError } from 'h3'


/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { DeleteMHOK } from '../../dal/MHOK'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // 解析 JSON body

  // TODO: ...

  return 0;
})
