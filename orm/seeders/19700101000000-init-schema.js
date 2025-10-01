'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 建立預設使用者角色清單
  const ret = await queryInterface.bulkInsert('user_roles', [
    { created_by: 'system', modified_by: 'system', title: 'admin', comment: '管理員' },
    { created_by: 'system', modified_by: 'system', title: 'manager', comment: '主管' },
    { created_by: 'system', modified_by: 'system', title: 'user', comment: '一般使用者' },
  ], { returning: true })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('user_roles', null, {})
}
