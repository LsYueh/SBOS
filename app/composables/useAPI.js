import { useFetch, useNuxtApp } from '#app';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 * @param {string} request The URL to fetch
 * @param {import('nuxt/app').UseFetchOptions<any>} [opts] extends $fetch options and useAsyncData options
 * @returns 
 */
export function useAPI(request, opts) {
  return useFetch(request, {
    ...opts,
    $fetch: useNuxtApp().$api,
  });
};
