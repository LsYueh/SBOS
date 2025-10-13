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
