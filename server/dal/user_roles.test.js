import { before, after, test } from 'tap'

import { usePgPool } from '../utils/db.js'

import * as u from './users.js'
import * as r from './roles.js'
import * as ur from './user_roles.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Test Setup
---------+---------+---------+---------+---------+---------+---------+--------*/

let user_id = null
const roles = []

const testUserName = 'tap-test'

before(async () => {
  user_id = await u.createUser({
    created_by: testUserName, modified_by: testUserName,
    account: 'test-01', name: 'test', description: 'The test user of node-tap.'
  });

  const _r = await r.getRoles()
  for (const v of _r) {
    roles.push({
      created_by: testUserName,
      modified_by: testUserName,
      role_id: v.id
    })
  }
});

after(async () => {
  if (user_id) {
    await u.deleteUser(user_id)
  }

  await pool.end()
});

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tests
---------+---------+---------+---------+---------+---------+---------+--------*/

test('User Roles CRUD Test', async (t) => {
  const affectedRow = await ur.upsertUserRoles({ user_id, roles })
  t.equal(affectedRow, roles.length)

  // TODO: 刪掉Roles
})
