import BitSet from 'bitset'
import { usePgPool } from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/
/
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
 * @returns 
 */
export async function create(input) {
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
