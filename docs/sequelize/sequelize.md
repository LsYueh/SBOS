# Sequelize

```
sbos/
 ├─ orm/
 │   ├─ config/config.js
 │   ├─ models/
 │   ├─ migrations/
 │   └─ seeders/
 ├─ server/
 ├─ package.json
 └─ .env
```

Sequelize 相關檔案（models、migrations、seeders、config）目前集中在 **`sbos/orm`** 底下。  

<br>

# 設定 `sequelize-cli` 路徑

在專案根目錄新增 `.sequelizerc` 檔案，指定 Sequelize 要找的路徑：

```js
const path = require('path');

module.exports = {
  'config': path.resolve('orm/config/config.js'),
  'models-path': path.resolve('orm/models'),
  'seeders-path': path.resolve('orm/seeders'),
  'migrations-path': path.resolve('orm/migrations')
};
```

這樣初始化後所有 migration/seed/model 都會跑到 `orm/` 裡。
```bash
npx sequelize-cli init
```

<br>

# 手動修改成ESM
`npx sequelize-cli init` 預設產出的 `models/index.js`、`config/config.js`、`migrations/`、`seeders/` 都是 CommonJS 格式，無法直接產生 ESM。  

* `models/index.js` → 改成 ESM：

    ```js
    import fs from 'fs'
    import path from 'path'
    import { fileURLToPath } from 'url'
    import { Sequelize, DataTypes } from 'sequelize'
    import configFile from '../config/config.js'

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const basename = path.basename(__filename)
    const env = process.env.NODE_ENV || 'development'
    const config = configFile[env]
    const db = {}

    let sequelize
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config)
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config)
    }

    const files = fs.readdirSync(__dirname).filter(file => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    })

    for (const file of files) {
      const modelModule = await import(path.join(__dirname, file))
      const model = modelModule.default(sequelize, DataTypes)
      db[model.name] = model
    }

    for (const modelName of Object.keys(db)) {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    }

    db.sequelize = sequelize
    db.Sequelize = Sequelize

    export default db
    ```

* 每個 model 也改成 ESM：

    ```js
    export default (sequelize, DataTypes) => {
      const User = sequelize.define('User', { username: DataTypes.STRING })
      return User
    }
    ```

* **migration/seeder**改成 ESM：  
    改 `module.exports` → `export async function up/down(...) {}`
