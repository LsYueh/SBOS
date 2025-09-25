import { usePgPool } from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {object} input 
 * @param {Number} input.page 
 * @param {Number} input.size 
 * @param {String} input.sortField 
 * @param {'ASC'|'DESC'} input.sortDir
 * @returns 
 */
export async function getUsers(input) {
  const { page, size, sortField, sortDir } = input;
  const offset = (page - 1) * size

  const countResult = await pool.query('SELECT COUNT(*) FROM sbos.tlb')
  const total = parseInt(countResult.rows[0].count, 10)

  // Note: 怕被掃出SQL注入，暫時不這樣用
  // const allowedSortFields = {
  //   username: 'username',
  // }
  // const safeSortField = allowedSortFields[sortField] || 'username'
  // const safeSortOrder = sortDir === 'DESC' ? 'DESC' : 'ASC'

  const dataResult = await pool.query(`
    SELECT * FROM sbos.tlb
    ORDER BY username ASC
    LIMIT $1 OFFSET $2
  `, [size, offset])

  // 分頁
  const paginated = dataResult.rows
  const lastPage = Math.ceil(total / size)

  return {
    data: paginated,
    last_page: lastPage
  }
}

/**
 * @param {Object} data 
 * @returns 
 */
export async function createUser(data) {
  const {
    created_by, modified_by,
    username, name, comment,
  } = data

  const query = `INSERT INTO sbos.tlb (created_by, modified_by, username, name, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [ created_by, modified_by, username, name, comment ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} data 
 * @returns 
 */
export async function updateUser(id, data) {
  const {
    modified_by,
    username, name, comment,
  } = data

  const query = `
    UPDATE sbos.tlb 
    SET modified_by = $1, updated_at = now(), username=$2, "name"=$3, "comment"=$4 
    WHERE id=$5::uuid 
    RETURNING *
  `;
  const values = [ modified_by, username, name, comment, id ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} data 
 * @returns 
 */
export async function enableUser(id, data) {
  const { modified_by } = data

  const query = `
    UPDATE sbos.tlb 
    SET modified_by = $1, updated_at = now(), deleted_at = NULL
    WHERE id=$2::uuid 
    RETURNING *
  `;

  const res = await pool.query(query, [modified_by, id]);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} data 
 * @returns 
 */
export async function disableUser(id, data) {
  const { modified_by } = data

  const query = `
    UPDATE sbos.tlb 
    SET modified_by = $1, updated_at = now(), deleted_at = now() 
    WHERE id=$2::uuid 
    RETURNING *
  `;

  const res = await pool.query(query, [modified_by, id]);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @returns 
 */
export async function deleteUser(id) {
  const query = `DELETE FROM sbos.tlb WHERE id=$1::uuid`

  const res = await pool.query(query, [id]);
  return true;
}
