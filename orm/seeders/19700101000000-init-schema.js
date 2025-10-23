'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 建立預設使用者角色清單
  await queryInterface.bulkInsert('roles', [
    { created_by: 'system', modified_by: 'system', title: 'admin', description: '管理員' },
    { created_by: 'system', modified_by: 'system', title: 'manager', description: '主管' },
    { created_by: 'system', modified_by: 'system', title: 'user', description: '一般使用者' },
  ], { returning: true })

  // 建立基本(URL)資源
  await queryInterface.bulkInsert('resources', [
    { created_by: 'system', modified_by: 'system', key: 'PAGE_TLB_VIEW', description: 'TLB', resource: '/tlb', action: '15' },
    { created_by: 'system', modified_by: 'system', key: 'PAGE_PRSB_VIEW', description: 'PRSB', resource: '/prsb', action: '15' },
    { created_by: 'system', modified_by: 'system', key: 'PAGE_PRSB_RESOURCE_VIEW', description: '', resource: '/prsb/resource', action: '15' },
  ], { returning: true })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {})
  await queryInterface.bulkDelete('resources', null, {})
}
