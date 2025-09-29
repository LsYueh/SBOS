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
 * @returns (UUIDv1)
 */
async function getAdminRoleID() {
  const res = await pool.query(`SELECT UR.id FROM sbos.user_roles UR WHERE UR.title='admin'`)
  return res.rows[0].id ?? '00000000-0000-0000-0000-000000000000'
}

/**
 * @returns 
 */
async function howManyUsersAreInTLB() {
  const res = await pool.query('SELECT COUNT(*) FROM sbos.tlb')
  return parseInt(res.rows[0].count, 10)
}

/**
 * @param {Object} input 
 * @param {string} input.username 
 * @returns 
 */
async function createFirstUser(input) {
  const { username } = input

  const role_id = await getAdminRoleID()

  const query = `INSERT INTO sbos.tlb (created_by, modified_by, username, name, role_id, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [ 'system', 'system', username, username, role_id, 'The first user of SBOS.' ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 開天闢地的第一人
 * @param {Object} input 
 * @param {string} input.username 
 */
export async function firstUseCheck(input) {
  const { username } = input

  const total = await howManyUsersAreInTLB()
  if (total === 0) await createFirstUser({ username })
}

/**
 * @param {Object} input 
 * @param {string} input.username 
 * @returns 
 */
export async function checkIfAnUserExists(input) {
  const { username } = input

  const res = await pool.query(`SELECT T.username FROM sbos.tlb T WHERE T.username=$1 AND T.deleted_at IS NULL`, [username])

  return res.rows[0]?.username === username;
}

/**
 * @param {object} input 
 * @param {Number} input.page 
 * @param {Number} input.size 
 * @param {String} input.sortField 
 * @param {'ASC'|'DESC'} input.sortDir
 * @returns 
 */
export async function getPagedUsers(input) {
  const { page, size, sortField, sortDir } = input;
  const offset = (page - 1) * size

  const total = await howManyUsersAreInTLB()

  // Note: 怕被掃出SQL注入，暫時不這樣用
  // const allowedSortFields = {
  //   username: 'username',
  // }
  // const safeSortField = allowedSortFields[sortField] || 'username'
  // const safeSortOrder = sortDir === 'DESC' ? 'DESC' : 'ASC'

  const res = await pool.query(`
    SELECT T.*, COALESCE(UR.title, '(未知)') as role_title 
    FROM sbos.tlb T 
    LEFT JOIN sbos.user_roles UR ON T.role_id = UR.id 
    ORDER BY T.username asc 
    LIMIT $1 OFFSET $2
  `, [size, offset])

  // 分頁
  const paginated = res.rows
  const lastPage = Math.ceil(total / size)

  return {
    data: paginated,
    last_page: lastPage
  }
}

/**
 * @param {Object} input 
 * @param {string} input.created_by 
 * @param {string} input.modified_by 
 * @param {string} input.username 
 * @param {string} input.name 
 * @param {string} input.role_id 
 * @param {string} input.comment 
 * @returns 
 */
export async function createUser(input) {
  const {
    created_by, modified_by,
    username, name, role_id, comment,
  } = input

  const query = `INSERT INTO sbos.tlb (created_by, modified_by, username, name, role_id, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [ created_by, modified_by, username, name, role_id, comment ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function updateUser(id, input) {
  const {
    modified_by,
    username, name, role_id, comment,
  } = input

  const query = `
    UPDATE sbos.tlb 
    SET modified_by = $1, updated_at = now(), username=$2, "name"=$3, role_id=$4, "comment"=$5 
    WHERE id=$6::uuid 
    RETURNING *
  `;
  const values = [ modified_by, username, name, role_id, comment, id ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function enableUser(id, input) {
  const { modified_by } = input

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
 * @param {Object} input 
 * @returns 
 */
export async function disableUser(id, input) {
  const { modified_by } = input

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
