import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** @type {import('pg').Pool} */
let pool = null

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 取得 PostgreSQL 連線池
 * @param {*} [config] Config Override
 * @returns 
 * 
 * @example
 * const pool = usePgPool()
 * const result = await pool.query('SELECT NOW()')
 * console.log(result.rows)
 */
export function usePgPool(config = null) {
  if (!pool) {

    // Nuxt 環境：優先使用 useRuntimeConfig()
    if (typeof useRuntimeConfig === 'function') {
      try {
        // eslint-disable-next-line no-undef
        config = useRuntimeConfig()
      } catch (e) {
        // 如果 Nuxt context 不存在，回頭走 dotenv
      }
    }

    // 非 Nuxt 環境：讀取 dotenv
    if (!config) {
      dotenv.config() // 預設讀取 .env
      config = {
        dbHost: process.env.POSTGRES_HOST     || 'localhost',
        dbPort: process.env.POSTGRES_DB_PORT  ? Number(process.env.DB_PORT) : 5432,
        dbUser: process.env.POSTGRES_USER     || 'sbos-db-user',
        dbPass: process.env.POSTGRES_PASSWORD || 'db-passwd',
        dbName: process.env.POSTGRES_DB       || 'postgres',
      }
    }

    if (!config || !config.dbUser) {
      throw new Error('資料庫設定未提供，請確認 Nuxt runtime 或 .env')
    }
    
    pool = new Pool({
      user    : config.dbUser,
      host    : config.dbHost,
      database: config.dbName,
      password: config.dbPass,
      port    : config.dbPort,
    })
  }

  return pool
}


/**------+---------+---------+---------+---------+---------+---------+----------
 * Legacy
---------+---------+---------+---------+---------+---------+---------+--------*/

import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

const defaultData = { MHOK: [],  MHIO: [],  MFIO: [], }

const adapter = new JSONFileSync('db.json')
const db = new LowSync(adapter, defaultData)

// db.read() // Note: 如果想要一開始就有資料就要呼叫read()

export default db