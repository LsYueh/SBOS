import { usePgPool } from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {string} user_id UUIDv1
 */
export async function getUserRoles(user_id) {
  const res = await pool.query(`
    SELECT UR.*, COALESCE(R.title, '(未知)') as role_title, COALESCE(R.description, '(未知)') as role_description
    FROM sbos.user_roles UR
    LEFT JOIN sbos.roles R ON UR.role_id = R.id   
    WHERE UR.user_id=$1::uuid AND UR.deleted_at IS NULL
    ORDER BY UR.created_at asc
  `, [user_id])

  return res.rows ?? []
}

/**
 * @param {object} input
 * @param {string} input.user_id
 * @param {object[]} input.roles
 */
export async function upsertUserRoles(input) {
  const { user_id, roles } = input
  
  const newUserRoles = [];

  for (const _v of roles) {
    const { created_by, modified_by, role_id } = _v;

    newUserRoles.push({
      created_by, modified_by, user_id, role_id
    })
  }

  const client = await pool.connect()

  let affectedRow = 0

  try {
    await client.query('BEGIN')

    // 檢查目前使用者的角色
    const res = await pool.query(`SELECT UR.role_id FROM sbos.user_roles UR WHERE user_id=$1::uuid`, [ user_id ]);

    // TODO: 更新刪除註記

    // TODO: 新增角色

    // TODO: 再讀一次來更新affectedRow

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return affectedRow
}
