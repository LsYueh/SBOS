import BitSet from 'bitset';
import { usePgPool } from '../utils/db.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * BitSet to Actions
 * @param {BitSet} bitSet 
 * @returns 
 */
function btoa(bitSet) {
  const bs = new BitSet;
  return []
}

/**
 * Actions to BitSet
 * @param {string[]} action 
 * @returns 
 */
function atob(action) {
  const bs = new BitSet;
  return bs
}

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
    `INSERT INTO sbos.permissions (created_by, modified_by, key, description, resource, action) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [ created_by, modified_by, key, description, resource, action ]
  );

  const permissions_id = res.rows[0].id;

  return permissions_id
}

/**
 * @returns 
 */
export async function read() {
  const res = await pool.query(`SELECT P.* FROM sbos.permissions P`)
  return res.rows ?? []
}

/**
 * @param {object} input 
 * @returns 
 */
export async function updateResource(input) {
  // TODO: ...
}

/**
 * @param {object} input 
 * @returns 
 */
export async function updateAction(input) {
  // TODO: ...
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function enable(id, input) {
  // TODO: ...
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function disable(id, input) {
  // TODO: ...
}

/**
 * @returns 
 */
export async function del() {
  // TODO: ...
}
