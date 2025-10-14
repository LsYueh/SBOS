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
 * @param {object} input 
 * @param {string} input.created_by 
 * @returns 
 */
export async function create(input) {
  const {
    created_by, modified_by,
    key, description, resource, action
  } = input;

  const res = await pool.query(
    `INSERT INTO sbos.resources (created_by, modified_by, key, description, resource, action) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [ created_by, modified_by, key, description, resource, action ]
  );

  return res.rows[0]?.id ?? null;
}

/**
 * @returns 
 */
export async function read() {
  const res = await pool.query(`SELECT P.* FROM sbos.resources P ORDER BY P.resource ASC`)
  return res.rows ?? []
}

/**
 * @param {string} id (UUIDv1)
 * @param {object} input 
 * @returns 
 */
export async function update(id, input) {
  const {
    modified_by,
    description, resource, action
  } = input;

  const query = `
    UPDATE sbos.resources 
    SET modified_by = $1, updated_at = now(), "description"=$2, resource=$3, action=$4 
    WHERE id=$5::uuid 
    RETURNING id
  `;
  const values = [ modified_by, description, resource, action, id ];

  const res = await pool.query(query, values);

  return res.rows[0]?.id ?? null;
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function enable(id, input) {
  const { modified_by } = input;

  const query = `
    UPDATE sbos.resources 
    SET modified_by = $1, updated_at = now(), deleted_at = NULL
    WHERE id=$2::uuid 
    RETURNING id
  `;

  const res = await pool.query(query, [modified_by, id]);

  return res.rows[0]?.id ?? null;
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function disable(id, input) {
  const { modified_by } = input

  const query = `
    UPDATE sbos.resources 
    SET modified_by = $1, updated_at = now(), deleted_at = now() 
    WHERE id=$2::uuid 
    RETURNING id
  `;

  const res = await pool.query(query, [modified_by, id]);

  return res.rows[0]?.id ?? null;
}

/**
 * @param {string} id (UUIDv1)
 * @returns 
 */
export async function del(id) {
  await pool.query(`DELETE FROM sbos.resources WHERE id=$1::uuid`, [id]);
  return true;
}
