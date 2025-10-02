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
