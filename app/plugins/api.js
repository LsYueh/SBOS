import { defineNuxtPlugin } from '#app';

import { useUserStore } from '@/stores/user.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Nuxt Plugin
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtPlugin((nuxtApp) => {
  const user = useUserStore(); // pinia store

  const api = $fetch.create({
    onRequest({ request, options, error }) {
      // 取得前端目前頁面 URL（resource endpoint）
      const route = nuxtApp.$router.currentRoute.value;
      const resource = route.path; // 例: /posts /users /reports

      // Headers: Authorization
      if (user.token) {
        options.headers = options.headers || {};
        options.headers.set('Authorization', `Bearer ${user.token}`);
      }

      // 自動處理 body，使其永遠是物件（避免 undefined）
      if (options.method && options.method !== 'GET') {
        if (!options.body) options.body = {};
      }

      // 決定 action（RBAC 設計需要）
      const method = (options.method || 'GET').toUpperCase();

      // 若使用者自行傳入 action 則尊重；否則自動決定
      let action = options.body?.action || options.query?.action;

      if (!action) {
        switch (method) {
          case 'GET':     action = 'read'; break;
          case 'POST':    action = 'create'; break;
          case 'PUT':     action = 'update'; break;
          case 'DELETE':  action = 'delete'; break;
          default:        action = null; break;
        }
      }

      // 將 action 與 resource 附加到 request body
      // ※ GET 方法不能附 body → 改用 query
      if (method === 'GET') {
        options.query = Object.assign({}, options.query, {
          action,
          resource,
        });
      } else {
        options.body = Object.assign({}, options.body, {
          action,
          resource,
        });
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
