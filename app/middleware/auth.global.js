import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app';

import { useUserStore } from '@/stores/user.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports Nuxt Route Middleware
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtRouteMiddleware((to, from) => {
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

  // RBAC - 檢查使用者是否可進入頁面
  const hasPermission = user.hasPermission(to.path, 'view');
  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
})
