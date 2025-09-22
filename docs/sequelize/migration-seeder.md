# 建立 migration

指令: 
```bash
npx sequelize-cli migration:generate --name $MIGRATION_NAME
```

migration 範例 (ESM 版本):  
```js
/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

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

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Posts')
  await queryInterface.dropTable('Users')
}

```

<br>

# 建立 Seeder

指令: 
```bash
npx sequelize-cli seed:generate --name $SEEDER_NAME
```

seed 範例 (ESM 版本): 
```js
/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  const userId1 = 'd11ecdd5-f572-4089-a1bc-76b632fd0a6b'
  const userId2 = 'e22fdcda-7a7a-4b77-bc17-f6c41b2c1234'

  // 插入 Users
  await queryInterface.bulkInsert('Users', [
    { id: userId1, username: 'Alice', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
    { id: userId2, username: 'Bob', email: 'bob@example.com', createdAt: new Date(), updatedAt: new Date() }
  ])

  // 插入 Posts
  await queryInterface.bulkInsert('Posts', [
    { title: 'Hello World', content: 'First post', UserId: userId1, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Nuxt + Sequelize', content: 'Second post', UserId: userId2, createdAt: new Date(), updatedAt: new Date() }
  ])
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Posts', null, {})
  await queryInterface.bulkDelete('Users', null, {})
}

```
<br>

# 執行 Migration 與 Seeder
```bash
# 建表
npx sequelize-cli db:migrate

# 插入 Seeder
npx sequelize-cli db:seed:all

# 回滾最後一個 Seeder
npx sequelize-cli db:seed:undo

# 回滾最後一個 Migration
npx sequelize-cli db:migrate:undo

```

<br>

# 注意事項

1. PostgreSQL UUID：確保 `CREATE EXTENSION "uuid-ossp"`
