import { defineEventHandler, readBody, createError } from 'h3'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // 解析 JSON body

  // TODO: 寫入MHOK暫存

  // TODO: 寫入MHIO並分單

  return {
    success: true
  }
})
