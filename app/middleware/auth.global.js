/* global defineNuxtRouteMiddleware, navigateTo useUserStore */

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore()

  user.loadFromCookie()

  // 排除 login 頁面，其他頁面都要驗證
  if (!user.isLoggedIn && to.path !== '/') {
    return navigateTo('/')
  }

  // 已登入後，嘗試存取 login 頁面的行為會轉入 dashboard
  if (user.isLoggedIn && to.path === '/') {
    return navigateTo('/dashboard')
  }
})
