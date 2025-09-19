/* global useCookie */

import { defineStore } from 'pinia'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Store
---------+---------+---------+---------+---------+---------+---------+--------*/

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    isLoggedIn: false,
  }),
  actions: {
    /**
     * @param {string} username 
     * @param {string} password 
     * @returns 
     */
    async login(username, password) {
      try {
        const res = await $fetch('/api/auth', {
          method: 'POST',
          body: { username, password }
        })
        
        this.username = username
        this.token = res.token
        this.isLoggedIn = true

        // 用 Nuxt useCookie 儲存 username與token
        const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 }) // 1 天
        tokenCookie.value = res.token

        const usernameCookie = useCookie('username', { maxAge: 60 * 60 * 24 }) // 1 天
        usernameCookie.value = username

        return true
      } catch (err) {
        this.logout()
        throw err
      }
    },

    logout() {
      this.token = ''
      this.username = ''
      this.isLoggedIn = false

      const tokenCookie = useCookie('token')
      tokenCookie.value = null

      const usernameCookie = useCookie('username')
      usernameCookie.value = null
    },

    loadFromCookie() {
      const tokenCookie = useCookie('token')
      if (tokenCookie.value) {
        this.token = tokenCookie.value
        this.isLoggedIn = true
      }

      const usernameCookie = useCookie('username')
      if (usernameCookie.value) {
        this.username = usernameCookie.value
      }
    }
  }
})
