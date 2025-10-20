import { defineNuxtPlugin } from '#app';

import { useUserStore } from '@/stores/user.js';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Nuxt Plugin
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtPlugin((nuxtApp) => {
  const user = useUserStore(); // pinia store

  const api = $fetch.create({
    onRequest({ request, options, error }) {
      if (user.token) {
        options.headers.set('Authorization', `Bearer ${user.token}`)
      }
    },
    // async onResponseError ({ response }) {
    //   if (response.status === 401) {
    //     await nuxtApp.runWithContext(() => navigateTo('/login'))
    //   }
    // },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    }
  };
});
