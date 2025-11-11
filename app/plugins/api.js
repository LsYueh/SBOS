import { defineNuxtPlugin } from '#app';

import { useUserStore } from '@/stores/user.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Nuxt Plugin
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtPlugin((nuxtApp) => {
  const user = useUserStore(); // pinia store

  const api = $fetch.create({
    onRequest({ request, options, error }) {
      // Headers: Authorization
      if (user.token) {
        options.headers = options.headers || {};
        options.headers.set('Authorization', `Bearer ${user.token}`);
      }

      // 從 Nuxt Router 取得目前 route path
      const route = nuxtApp.$router.currentRoute.value;
      const resource = route.path;
      options.headers.set('X-Sbos-Resource-Endpoint', resource);

      // 如果 fetch options 有傳 action，就加到 header
      if (options.action) {
        options.headers['X-Sbos-User-Action'] = options.action;
        // 避免 $fetch 認為 options 有未知屬性，刪掉
        delete options.action;
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    }
  };
});
