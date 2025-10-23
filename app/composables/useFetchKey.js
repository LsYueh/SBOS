/**
 * 產生 結合「時間戳 + 短亂數」的 key  
 * ✅ 不保證唯一，但足夠避免 useFetch 快取  
 * ✅ 可讀性高，方便除錯  
 * ✅ 可自訂 prefix 與亂數長度  
 *
 * @param prefix    用於辨識資料用途 (預設: 'key')
 * @param len       亂數碼長度 (預設: 5)
 * @returns string  ex: "posts-lm0a3k-4p7zq"
 */
export function useFetchKey(prefix = 'key', len = 5) {
  const timePart = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 2 + len)
  return `${prefix}-${timePart}-${randomPart}`
}
