'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 建立預設使用者角色清單
  const ret = await queryInterface.bulkInsert('user_roles', [
    { created_by: 'system', modified_by: 'system', title: 'admin' },
    { created_by: 'system', modified_by: 'system', title: 'manager' },
    { created_by: 'system', modified_by: 'system', title: 'user' },
  ], { returning: true })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('user_roles', null, {})
}
