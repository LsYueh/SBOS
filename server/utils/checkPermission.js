import { db } from './db';

/**
 * 
 * @param {string} userId 
 * @param {string} resource 
 * @param {string} action 
 * @returns 
 */
export async function checkPermission(userId, resource, action) {
  // const sql = `
  //   SELECT COUNT(*) > 0 AS allowed
  //   FROM user_roles ur
  //   JOIN role_permissions rp ON ur.role_id = rp.role_id
  //   JOIN permissions p ON rp.permission_id = p.permission_id
  //   WHERE ur.user_id = ?
  //     AND p.resource = ?
  //     AND p.action = ?
  // `;
  // const [result] = await db.query(sql, [userId, resource, action]);
  // return result.allowed === 1;

  // TODO: ...

  return true;
}