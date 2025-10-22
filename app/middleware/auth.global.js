import { defineNuxtRouteMiddleware, navigateTo, createError, showError } from '#app';

import { useUserStore } from '@/stores/user.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports Nuxt Route Middleware
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUserStore();

  user.loadFromCookie();

  // 排除 login 頁面，其他頁面都要驗證
  if (!user.isLoggedIn && to.path !== '/') {
    return navigateTo('/');
  }

  // 已登入後，嘗試存取 login 頁面的行為會轉入 dashboard
  if (user.isLoggedIn && to.path === '/') {
    return navigateTo('/dashboard');
  }

  // 不需驗證的路由白名單
  const publicRoutes = ['/', '/dashboard']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // 如果有前綴要排除
  // if (to.path.startsWith('/public')) {
  //   return
  // }

  // RBAC - 檢查使用者是否可進入頁面
  const hasPermission = await user.hasPermission(to.path, 'view');
  if (!hasPermission) {
    return showError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
})
