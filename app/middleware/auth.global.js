/* global defineNuxtRouteMiddleware, navigateTo useUserStore */

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // 從 cookie 載入 token
  userStore.loadFromCookie()

  // 排除 login 頁面，其他頁面都要驗證
  if (!userStore.isLoggedIn && to.path !== '/') {
    return navigateTo('/')
  }
})
