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
        { label: '交易明細 (MFIO)', to: '/MFIO', roles: ['admin', 'user'] },
        { label: '成交明細匯總 (MHIO)', to: '/MHIO', roles: ['admin', 'user'] },
        { label: '成交回報上傳 (MHOK)', to: '/MHOK', roles: ['admin', 'user'] },
      ]
    },
    {
      title: '報表',
      items: [
        { label: '庫存日報表 (MSTF)', to: '/report/MSTF', roles: ['admin', 'manager'] },
      ]
    },
    {
      title: '管理',
      items: [
        { label: '使用者設定 (TLB)', to: '/TLB', roles: ['admin'] },
        { label: '權限清單 (PRSB)', to: '/prsb', roles: ['admin'] },
        { label: '假日設定 (HLD)', to: '/HLD', roles: ['admin'] },
      ]
    },
  ]
})
