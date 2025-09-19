import { defineEventHandler, readBody, createError } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function userValidation(username, password) {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()

  // TODO: 替換成其他驗證（DB / LDAP / 3rd party)

  if (config.initialAdminPassword !== '') {
    // TODO: 檢查DB是否已經有Admin等級的使用者，沒有的話用local的做初始化設定

    if (username === 'admin' && password === config.initialAdminPassword) return true
  }

  return false
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'username and password are required' })
  }

  const isValid = await userValidation(username, password)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  return { token: 'abcd1234' }
})
