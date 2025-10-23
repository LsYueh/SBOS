import { createError, useCookie } from 'nuxt/app';

import { defineStore } from 'pinia';

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
        
        this.username = username;
        this.token    = res.token;

        this.isLoggedIn = true;

        // 用 Nuxt useCookie 儲存 username與token
        const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 }); // 1 天
        userCookie.value = { username, token: res.token };

        return true;
      } catch (err) {
        this.logout();
        
        throw createError({
          statusCode: err?.statusCode || 500,
          statusMessage: err?.data?.statusMessage || '未知錯誤'
        })
      }
    },

    logout() {
      this.token = '';
      this.username = '';
      this.isLoggedIn = false;

      const userCookie = useCookie('user');
      userCookie.value = null;
    },

    loadFromCookie() {
      const userCookie = useCookie('user');
      if (userCookie.value) {
        this.username = userCookie.value.username;
        this.token    = userCookie.value.token;

        this.isLoggedIn = true;
      };
    },

    /**
     * 
     * @param {string} resource 
     * @param {string} action 
     * @returns 
     */
    async hasPermission(resource, action = 'view') {
      const account = this.username;
      // eslint-disable-next-line no-undef
      const { data } = await useAPI(`/api/users/${account}`, {
        query: { resource, },
        key: String(Math.random()), // Disables caching by providing a unique key
      });

      const info = data.value;

      return (info[0]?.resource === resource);
    }
  }
})
