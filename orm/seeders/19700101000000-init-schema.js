'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 先插入 Users
  await queryInterface.bulkInsert('Users', [
    { username: 'Alice', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
    { username: 'Bob', email: 'bob@example.com', createdAt: new Date(), updatedAt: new Date() }
  ], { returning: true })

  // 取得剛剛插入的 Users id
  const users = await queryInterface.sequelize.query(
    'SELECT id FROM "Users" WHERE username IN (\'Alice\', \'Bob\');',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  )

  // 再插入 Posts
  await queryInterface.bulkInsert('Posts', [
    { title: 'Hello World', content: 'First post', UserId: users[0].id, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Nuxt + Sequelize', content: 'Second post', UserId: users[1].id, createdAt: new Date(), updatedAt: new Date() }
  ])
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Posts', null, {})
  await queryInterface.bulkDelete('Users', null, {})
}
