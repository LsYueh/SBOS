import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // 解析 JSON body

  // TODO: 單筆寫入MHIO

  return {
    success: true
  }
})
