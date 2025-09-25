
/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

//     .replace( // Index
//       /CREATE (UNIQUE )?INDEX IF NOT EXISTS\s+"?(\w+)"?.*?;/gis,
//       'DROP INDEX IF EXISTS "$2";'
//     )
//     .replace( // View
//       /CREATE(?: OR REPLACE)? VIEW\s+"?(\w+)"?.*?AS.*?;/gis,
//       'DROP VIEW IF EXISTS "$1";'
//     )
//     .replace( // Sequence
//       /CREATE SEQUENCE IF NOT EXISTS\s+"?(\w+)"?.*?;/gis,
//       'DROP SEQUENCE IF EXISTS "$1";'
//     )

/**
 * Table
 * @param {*} sql 
 */
function _table(sql) {
  const match = sql.match(/CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\s*\(/i);

  if(!match) return null

  const tableName = match[1]; // 取得 schema.table
  const dropStatement = `DROP TABLE IF EXISTS ${tableName};`;

  return dropStatement
}

/**
 * Extension
 * @param {*} sql 
 */
function _extension(sql) {
  const dropStatement = sql.replace(
    /CREATE EXTENSION IF NOT EXISTS\s+("[^"]+")\s*;/i,
    'DROP EXTENSION IF EXISTS $1;'
  )
  
  return dropStatement
}

/**
 * 將 CREATE 語法轉換成 DROP
 * @param {string} sql 
 * @returns
 */
export function rollbackSQL(sql) {
  let rollbackQuery = ''

  rollbackQuery = _table(sql)
  if (rollbackQuery) return rollbackQuery.trim()

  rollbackQuery = _extension(sql)
  if (rollbackQuery) return rollbackQuery.trim()

  throw new Error('No valid CREATE statement found for rollback.')
}
