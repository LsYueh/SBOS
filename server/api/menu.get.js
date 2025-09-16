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
        { label: '使用者管理', to: '/user', roles: ['admin'] },
        { label: '角色權限', to: '/roles', roles: ['admin'] },
        { label: '系統設定', to: '/settings', roles: ['admin', 'manager'] }
      ]
    },
    {
      title: '操作',
      items: [
        { label: '資料匯入', to: '/import', roles: ['admin', 'user'] },
        { label: '資料匯出', to: '/export', roles: ['admin', 'user'] },
        { label: '操作紀錄', to: '/logs', roles: ['admin'] }
      ]
    }
  ]
})
