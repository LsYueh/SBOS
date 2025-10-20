import { useFetch, useNuxtApp } from '#app';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 * @param {string} url 
 * @param {UseFetchOptions} [options] 
 * @returns 
 */
export function useAPI (url, options) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
};
