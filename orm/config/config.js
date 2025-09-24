import 'dotenv/config'

const dialectOptions = {
}
  
const define = {
  schema: 'sbos'
}

const searchPath = 'sbos, public';

export default {
  development: {
    username: 'sbos-db-user',
    password: 'db-passwd',
    database: 'postgres',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions, define, searchPath,
  },
  test: {
    username: 'sbos-db-user',
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions, define, searchPath,
  },
  production: {
    username: 'sbos-db-user',
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions, define, searchPath,
  }
}
