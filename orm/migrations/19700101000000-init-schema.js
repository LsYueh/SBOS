import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { rollbackSQL } from '../utils.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/**  */
const parsedPath = path.parse(__filename);

const sqlRootDir = '../../sql';
const sqlDir = path.join(__dirname, sqlRootDir, parsedPath.name);

/**------+---------+---------+---------+---------+---------+---------+----------
 * up/down
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  console.log(`Migration SQL files in: '${sqlDir}'`);

  const files = fs.readdirSync(sqlDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // 依檔名排序執行

  for (const file of files) {
    const sqlPath = path.join(sqlDir, file);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`Running SQL file: ${file}`);
    await queryInterface.sequelize.query(sql);
  }
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  console.log(`Rolling back SQL files in: '${sqlDir}'`);

  const files = fs.readdirSync(sqlDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .reverse(); // 逆序回滾

  for (const file of files) {
    const sqlPath = path.join(sqlDir, file);
    const sql = fs.readFileSync(sqlPath, 'utf8')

    const rollbackQuery = rollbackSQL(sql);

    console.log(`Rolling back SQL file: ${file}`);
    console.log(rollbackQuery);
    
    if (rollbackQuery) {
      await queryInterface.sequelize.query(rollbackQuery);
    }
  }
  
  // Note: 確定升級無誤後要鎖死rollback
  // console.log('Migration rollback skipped, SequelizeMeta not updated.');
  // throw new Error('rollback not applied.');
}
