import { defineEventHandler, readBody, createError } from 'h3'
import { firstUseCheck, checkIfAnUserExists } from '../dal/TLB.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function userValidation(username, password) {
  await firstUseCheck({ username })

  if (!await checkIfAnUserExists({ username })) throw createError({ statusCode: 401, statusMessage: '使用者不存在' })

  // TODO: LDAP / SSO / OAuth2 / SAML / OIDC

  return true
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

  // TODO: token
  return { token: 'abcd1234' }
})
