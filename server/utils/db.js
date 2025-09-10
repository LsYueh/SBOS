import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

const defaultData = { MHOK: [],  MHIO: [],  MFIO: [], }

const adapter = new JSONFileSync('db.json')
const db = new LowSync(adapter, defaultData)

// db.read() // Note: 如果想要一開始就有資料就要呼叫read()

export default db
