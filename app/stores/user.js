/* global useCookie */

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false,
    token: '' // 主要在 cookie 裡儲存
  }),
  actions: {
    /**
     * @param {string} username 
     * @param {string} password 
     * @returns 
     */
    async login(username, password) {
      try {
        // 模擬 API
        const fakeApi = (u, p) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (u === 'admin\\root' && p === '0000') resolve({ token: 'abcd1234' })
              else reject(new Error('帳號或密碼錯誤'))
            }, 500)
          })

        const res = await fakeApi(username, password)
        
        this.username = username
        this.isLoggedIn = true
        this.token = res.token

        // 用 Nuxt useCookie 儲存 token
        const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 }) // 1 天
        tokenCookie.value = res.token

        return true
      } catch (err) {
        this.logout()
        throw err
      }
    },

    logout() {
      this.username = ''
      this.isLoggedIn = false
      this.token = ''
      const tokenCookie = useCookie('token')
      tokenCookie.value = null
    },

    loadFromCookie() {
      const tokenCookie = useCookie('token')
      if (tokenCookie.value) {
        this.token = tokenCookie.value
        this.isLoggedIn = true
        
        // TODO: 把 username 從 cookie 或 API 取回
        this.username = '000000'
      }
    }
  }
})
