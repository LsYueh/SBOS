# Sequelize-Auto
Automatically generate models for SequelizeJS via the command line.

`(建議寫SQL，ORM效能問題堪憂，尤其是在滾帳的時候更明顯)`

```bash
npm install --save-dev sequelize-auto
```

## Pre-Requisites
You will need to install the correct dialect binding before using sequelize-auto.

Dialect | Install
---|---
MySQL/MariaDB | `npm install sequelize mysql2`
Postgres | `npm install sequelize pg pg-hstore`
Sqlite | `npm install sequelize sqlite3`
MSSQL | `npm install sequelize tedious`

<br>

# 使用 `sequelize-auto`

執行指令：

```bash
npx sequelize-auto -o "./out-models" -d postgres -h 127.0.0.1 -u db-admin -p 5432 -x db-passwd -e postgres --lang esm
```

## 參數說明

| 參數           | 說明                         |
| ------------ | -------------------------- |
| `-o`         | 輸出資料夾，生成的 model 會放在這裡      |
| `-d`         | 資料庫名稱                      |
| `-h`         | 主機                         |
| `-u`         | 使用者                        |
| `-p`         | port                       |
| `-x`         | 密碼                         |
| `-e`         | dialect (`postgres`)       |
| `--lang esm` | 生成 ESM 版本 model（Nuxt 專案必須） |

> 可以加 `-t tableName` 指定特定 table，或不加生成全部 table。

<br>

## 生成後的 ESM model 範例

假設 table `Users` 生成後：

```js
import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Users',
    timestamps: true
  })

  return Users
}
```

<br>
