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
    SELECT UR.role_id, COALESCE(R.title, '(未知)') as role_title 
    FROM sbos.user_roles UR
    LEFT JOIN sbos.roles R ON UR.role_id = R.id   
    WHERE user_id=$1::uuid
    ORDER BY UR.created_at asc
  `, [user_id])

  return res.rows ?? []
}
