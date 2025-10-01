import pkg from 'pg'

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
 * @returns 
 * 
 * @example
 * const pool = usePgPool()
 * const result = await pool.query('SELECT NOW()')
 * console.log(result.rows)
 */
export function usePgPool() {
  if (!pool) {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
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