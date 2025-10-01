import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { usePgPool } from '../utils/db.js'

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Database Pool */
const pool = usePgPool()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Day.js
---------+---------+---------+---------+---------+---------+---------+--------*/

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat);

// 預設用台北時區
dayjs.tz.setDefault('Asia/Taipei')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 日期註記  
 * N: 工作日, Y: 假日(國定假日), V: 非正常假日, L:假日延長交易
 * @param {String} dateStr YYYY-MM-DD
 */
export function setMark(dateStr) {
  // 嚴格模式下的月日格式
  const format = ['YYYY-MM-DD', 'YYYY-MM-D', 'YYYY-M-DD', 'YYYY-M-D']

  // 不存在的日期
  if (!format.some(fmt => dayjs(dateStr, fmt, true).isValid())) return ' '

  // 週末
  const d = dayjs(dateStr, format, true);
  const day = d.day();
  if (day === 0 || day === 6) return 'Y'

  // 工作日
  return 'N'
}

/**
 * @param {number} year 
 */
function defaultFlagSet(year) {
  const flagSet = [];

  for (let mm = 1; mm <= 12; mm++) {
    for (let dd = 1; dd <= 31; dd++) {
      flagSet.push(setMark(`${year}-${mm}-${dd}`))
    }
  }

  // COBOL Styled
  return flagSet.join('')
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {Number} year 
 * @param {String} [countryCode] ISO 3166-1 alpha-3
 * @returns {String}
 */
export async function ReadHLD(year, countryCode = 'TWN') {
  // 查詢是否有該年度的資料
  const res = await pool.query(
    `SELECT h.flag_set FROM sbos.hld h WHERE h."year" = $1 AND h.country_code = $2`, 
    [ year, countryCode ]
  )

  const flagSet = res.rows[0] ?? defaultFlagSet(year)

  return flagSet
}

/**
 * @param {Number} year 
 * @param {String} flagSet 
 * @param {String} [countryCode] ISO 3166-1 alpha-3
 */
export async function WriteHLD(year, flagSet, countryCode = 'TWN') {
  if (flagSet.length !== 372) return 0;
  
  const query = `
    UPDATE sbos.hld 
    SET flagSet = $1
    WHERE year = $2 AND country_code = $3
    RETURNING *
  `;
  const values = [ flagSet, year, countryCode ];

  const res = await pool.query(query, values);
  return res.rows[0];
}