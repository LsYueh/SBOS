'use strict';

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'
import { Sequelize, DataTypes } from 'sequelize'
import configFile from '../config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** basename */
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = configFile[env]

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** db */
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * 匯入 model
---------+---------+---------+---------+---------+---------+---------+--------*/

const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  )
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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

module.exports = db;
