import { usePgPool } from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 * @param {*[]} roles 
 * @returns 
 */
async function bulkUpsertUserRoles(roles) {
  if (roles.length <= 0) return 0

  const values = [];

  // 生成 $1,$2,$3 ... 的佔位符
  const placeholders = roles.map((row, i) => {
    const idx = i * 4; // 每筆有 4 欄位
    values.push(row.created_by, row.modified_by, row.user_id, row.role_id);
    return `($${idx+1}, $${idx+2}, $${idx+3}, $${idx+4})`;
  }).join(', ');

  const sql = `
    INSERT INTO sbos.user_roles (created_by, modified_by, user_id, role_id)
    VALUES ${placeholders}
    ON CONFLICT (user_id, role_id) DO UPDATE SET
      modified_by = EXCLUDED.modified_by,
      updated_at = now(),
      deleted_at = NULL
  `;


  const res = await pool.query(sql, values);

  return res.rowCount ?? 0;
}

/**
 * 
 * @param {string} user_id 
 * @param {*[]} roles 
 * @returns 
 */
async function bulkSoftDeleteUserRoles(user_id, roles) {
  // 檢查新增後的使用者的角色
  const RES_01 = await pool.query(`SELECT UR.role_id FROM sbos.user_roles UR WHERE UR.user_id = $1::uuid AND UR.deleted_at IS NULL`, [ user_id ]);
  const currentUserRoles = RES_01.rows

  // 取出 roles 的 id 集合
  const roleIdSet = new Set(roles.map(v => v.role_id));

  // 更新刪除註記
  const delRoles = currentUserRoles.filter((v) => !roleIdSet.has(v.role_id));
  const delRoleIds = delRoles.map(item => item.role_id);

  const res = await pool.query(`
    UPDATE sbos.user_roles
    SET updated_at = now(),
        deleted_at = now()
    WHERE user_id = $1::uuid AND role_id = ANY($2::uuid[])
  `, [ user_id, delRoleIds]);

  return res.rowCount;
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {string} user_id UUIDv1
 * @returns 
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
 * @returns 
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

    const u = await bulkUpsertUserRoles(newUserRoles)

    const d = await bulkSoftDeleteUserRoles(user_id, newUserRoles)

    // 更新affectedRow
    affectedRow = u + d

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return affectedRow
}
