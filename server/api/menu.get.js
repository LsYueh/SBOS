import { defineEventHandler, getQuery } from 'h3'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(() => {
  return [
    {
      title: '操作',
      items: [
        { label: '成交回報上傳 (MHOK)', to: '/MHOK', roles: ['admin', 'user'] },
        { label: '成交明細匯總 (MHIO)', to: '/MHIO', roles: ['admin', 'user'] },
      ]
    },
    {
      title: '報表',
      items: [
        { label: '銷售報表', to: '/report/sales', roles: ['admin', 'manager'] },
        { label: '庫存報表', to: '/report/inventory', roles: ['admin'] },
        { label: '財務報表', to: '/report/finance', roles: ['admin', 'manager'] }
      ]
    },
    {
      title: '管理',
      items: [
        { label: '假日設定 (HLD)', to: '/HLD', roles: ['admin'] },
      ]
    }
  ]
})
