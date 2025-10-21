/**
 * YYYY/MM/DD HH:mm
 * @param {string} v 
 * @returns 
 */
export function datetimeFormatter(v) {
  // eslint-disable-next-line no-undef
  const { $dayjs } = useNuxtApp();
  return v ? $dayjs(v).format('YYYY/MM/DD HH:mm') : '----/--/-- --:--:--'
}

/**
 * 將 bitValue (`Action`) 解析為對應的 options (`Permissions`) 名稱陣列
 * @param {number|string} bitValue - 權限整數或字串，例如 13 或 "13"
 * @param {string[]} options - 權限對應陣列，例如 ['A','B','C']
 * @returns {string[]} - 目前啟用的權限名稱
 */
export function getSelectedPermissions(bitValue, options) {
  if (!Array.isArray(options)) return [];

  const value = Number(bitValue)
  if (isNaN(value)) return [];

  // 過濾勾選的 bit 對應之權限名稱
  const permissions = options.filter((_, idx) => (value & (1 << idx)) !== 0);

  const str = permissions.join('／').trim(); // 文字排版，用全形

  return (str === '') ? '----' : str;
}
