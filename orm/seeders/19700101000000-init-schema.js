'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 建立預設使用者角色清單
  const ret = await queryInterface.bulkInsert('roles', [
    { created_by: 'system', modified_by: 'system', title: 'admin', description: '管理員' },
    { created_by: 'system', modified_by: 'system', title: 'manager', description: '主管' },
    { created_by: 'system', modified_by: 'system', title: 'user', description: '一般使用者' },
  ], { returning: true })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {})
}
