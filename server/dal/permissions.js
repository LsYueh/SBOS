import { usePgPool } from '../utils/db.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {string} role_id     (UUIDv1)
 * @param {string} resource_id (UUIDv1)
 * @param {object} input 
 * @param {string} input.created_by 
 * @returns 
 */
export async function create(role_id, resource_id, input) {
  const {
    created_by, modified_by, action
  } = input;

  const res = await pool.query(`
    INSERT INTO sbos.permissions (created_by, modified_by, role_id, resource_id, action) VALUES ($1, $2, $3, $4, $5) RETURNING role_id 
  `, [created_by, modified_by, role_id, resource_id, action]);

  return res.rows[0].role_id;
}

/**
 * @param {string} role_id 
 * @returns 
 */
export async function getRolePermissions(role_id) {
  const res = await pool.query(`
    SELECT P.*,
           COALESCE(RES.resource, '(未知)') as resource
    FROM sbos.permissions P
    LEFT JOIN sbos.resources RES ON P.resource_id = RES.id
    WHERE P.role_id=$1::uuid
    ORDER BY resource asc
  `, [role_id]);

  return res.rows ?? [];
}

/**
 * @param {string} role_id     (UUIDv1)
 * @param {string} resource_id (UUIDv1)
 * @param {object} input 
 * @returns 
 */
export async function update(role_id, resource_id,  input) {
  const {
    modified_by, action
  } = input

  const res = await pool.query(`
    UPDATE sbos.permissions
    SET modified_by = $3, updated_at = now(), "action" = $4
    WHERE role_id=$1::uuid AND resource_id=$2::uuid
    RETURNING role_id
  `, [role_id, resource_id, modified_by, action]);

  return res.rows[0].role_id;
}

/**
 * @param {string} role_id     (UUIDv1)
 * @param {string} resource_id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function enable(role_id, resource_id, input) {
  const { modified_by } = input;

  const query = `
    UPDATE sbos.permissions 
    SET modified_by = $3, updated_at = now(), deleted_at = NULL
    WHERE role_id=$1::uuid AND resource_id=$2::uuid
    RETURNING role_id
  `;

  const res = await pool.query(query, [role_id, resource_id, modified_by]);

  return res.rows[0].role_id;
}

/**
 * @param {string} role_id     (UUIDv1)
 * @param {string} resource_id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function disable(role_id, resource_id, input) {
  const { modified_by } = input

  const query = `
    UPDATE sbos.permissions 
    SET modified_by = $3, updated_at = now(), deleted_at = now() 
    WHERE role_id=$1::uuid AND resource_id=$2::uuid
    RETURNING role_id
  `;

  const res = await pool.query(query, [role_id, resource_id, modified_by]);

  return res.rows[0].role_id;
}

/**
 * @param {string} role_id     (UUIDv1)
 * @param {string} resource_id (UUIDv1)
 * @returns 
 */
export async function del(role_id, resource_id) {
  await pool.query(`
    DELETE FROM sbos.permissions
    WHERE role_id=$1::uuid AND resource_id=$2::uuid
  `, [role_id, resource_id]);

  return true;
}
