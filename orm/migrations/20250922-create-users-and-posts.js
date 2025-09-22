'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
  );

  // 建立 Users
  await queryInterface.createTable('Users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    username: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  })

  // 建立 Posts
  await queryInterface.createTable('Posts', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    title: { type: Sequelize.STRING(255), allowNull: false },
    content: { type: Sequelize.TEXT },
    UserId: {
      type: Sequelize.UUID,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  })
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Posts')
  await queryInterface.dropTable('Users')
}
