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
  const res = await pool.query(`SELECT R.id FROM sbos.roles R WHERE R.title='admin'`)
  return res.rows[0].id ?? '00000000-0000-0000-0000-000000000000'
}

/**
 * @returns 
 */
async function howManyUsersAreInTLB() {
  const res = await pool.query('SELECT COUNT(*) FROM sbos.users')
  return parseInt(res.rows[0].count, 10)
}

/**
 * @param {Object} input 
 * @param {string} input.account 帳號
 * @returns 
 */
async function createFirstUser(input) {
  const { account } = input

  const role_id = await getAdminRoleID()

  const user_id = await createUser({
    created_by: 'system', modified_by: 'system',
    account, name: 'admin', description: 'The first user of SBOS.',
    role_id
  });

  return user_id
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 開天闢地的第一人
 * @param {Object} input 
 * @param {string} input.account 帳號
 */
export async function firstUseCheck(input) {
  const { account } = input

  const total = await howManyUsersAreInTLB()
  if (total === 0) await createFirstUser({ account })
}

/**
 * @param {Object} input 
 * @param {string} input.account 
 * @returns 
 */
export async function checkIfAnUserExists(input) {
  const { account } = input

  const res = await pool.query(`SELECT U.account FROM sbos.users U WHERE U.account=$1 AND U.deleted_at IS NULL`, [ account ])

  return res.rows[0]?.account === account;
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

  const res = await pool.query(`
    WITH cte_role_counts AS (
        SELECT 
            UR.user_id, COUNT(*) AS role_count
        FROM sbos.user_roles UR
        WHERE UR.deleted_at IS NULL
        GROUP BY user_id
    )
    SELECT U.*, RC.role_count
    FROM sbos.users U
    LEFT JOIN cte_role_counts RC ON U.id = RC.user_id
    ORDER BY U.account asc
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
 * @param {string} input.account 
 * @param {string} input.name 
 * @param {string} input.description 
 * @param {string} [input.role_id] Default user role
 * @returns 
 */
export async function createUser(input) {
  const {
    created_by, modified_by,
    account, name, description,
    role_id,
  } = input

  const client = await pool.connect()

  /** @type {string?} User ID (UUIDv1) */
  let user_id = null

  try {
    await client.query('BEGIN')

    const RES_01 = await pool.query(
      `INSERT INTO sbos.users (created_by, modified_by, account, name, description) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [ created_by, modified_by, account, name, description ]
    );

    user_id = RES_01.rows[0].id

    if (role_id) {
      const RES_02 = await pool.query(
        `INSERT INTO sbos.user_roles (created_by, modified_by, user_id, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [ created_by, modified_by, user_id, role_id ]
      );
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return user_id
}

/**
 * @param {string} id (UUIDv1)
 * @param {Object} input 
 * @returns 
 */
export async function updateUser(id, input) {
  const {
    modified_by,
    name, description,
  } = input

  const query = `
    UPDATE sbos.users 
    SET modified_by = $1, updated_at = now(), "name"=$2, "description"=$3 
    WHERE id=$4::uuid 
    RETURNING *
  `;
  const values = [ modified_by, name, description, id ];

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
    UPDATE sbos.users 
    SET modified_by = $1, updated_at = now(), deleted_at = NULL
    WHERE id=$2::uuid 
    RETURNING id
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
    UPDATE sbos.users 
    SET modified_by = $1, updated_at = now(), deleted_at = now() 
    WHERE id=$2::uuid 
    RETURNING id
  `;

  const res = await pool.query(query, [modified_by, id]);
  return res.rows[0];
}

/**
 * @param {string} id (UUIDv1)
 * @returns 
 */
export async function deleteUser(id) {
  await pool.query(`DELETE FROM sbos.users WHERE id=$1::uuid`, [id]);
  return true;
}
