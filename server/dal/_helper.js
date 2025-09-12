/**
 * 比對兩個物件在指定屬性上的值是否一致
 * 如果值是 Date，會轉成 ISO 字串後再比對
 * @param {Object} obj1 - 第一個物件
 * @param {Object} obj2 - 第二個物件
 * @param {string[]} keys - 要比對的屬性名稱陣列
 * @returns {boolean}
 */
export function compareObjectsByKeys(obj1, obj2, keys) {
  const normalize = (val) => {
    if (val instanceof Date) return val.toISOString();
    return val;
  };

  return keys.every(key => normalize(obj1[key]) === normalize(obj2[key]));
}
