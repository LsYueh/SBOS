import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { compareObjectsByKeys } from './_helper.js'

import db from '../utils/db.js'

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
 * @param {*} MHIO 
 * @param {*} R3 (會故意補一個TDate)
 * @returns 
 */
function PK01(MHIO, R3) {
  const keys = [
    'Year', 'CountryCode',
  ]
  return compareObjectsByKeys(MHIO, R3, keys)
}

/**
 * 日期註記  
 * N: 工作日, Y: 假日(國定假日), V: 非正常假日 , L:假日延長交易
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

/**------+---------+---------+---------+---------+---------+---------+----------
 * Exports
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {Number} year 
 * @param {String} [countryCode] ISO 3166-1 alpha-3
 * @returns {String}
 */
export function ReadHLD(year, countryCode = 'TWN') {
  db.read()

  // 查詢是否有該年度的資料
  let HLD = db.data.HLD.find((HLD) => PK01(HLD, { Year: year, CountryCode: countryCode }))

  if (!HLD) {
    HLD = { Year: year, CountryCode: countryCode, FlagSet: '' };

    const flagSet = [];

    for (let mm = 1; mm <= 12; mm++) {
      for (let dd = 1; dd <= 31; dd++) {
        flagSet.push(setMark(`${year}-${mm}-${dd}`))
      }
    }

    // COBOL Styled
    HLD.FlagSet = flagSet.join('')
  }

  return HLD.FlagSet
}

/**
 * @param {Number} year 
 * @param {String} flagSet 
 * @param {String} [countryCode] ISO 3166-1 alpha-3
 */
export function WriteHLD(year, flagSet, countryCode = 'TWN') {
  if (flagSet.length !== 372) return 0;
  
  db.read()
  const HLD = db.data.HLD.find((HLD) => PK01(HLD, { Year: year, CountryCode: countryCode }))

  HLD.FlagSet = flagSet

  db.write()

  return 1;
}