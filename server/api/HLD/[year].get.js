import { defineEventHandler, getQuery, getRouterParam } from 'h3'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { ReadHLD } from '../../dal/HLD'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Day.js
---------+---------+---------+---------+---------+---------+---------+--------*/

dayjs.extend(utc)
dayjs.extend(timezone)

// 預設用台北時區
dayjs.tz.setDefault('Asia/Taipei')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {String} str 
 * @returns 
 */
function toYear(str) {
  const num = Number(str)

  if (!isFinite(num)) {
    const now = dayjs();
    const yearNum = now.year();
    return yearNum
  }

  return num
}

/**
 * @param {Number} year 
 * @param {Number} month 
 * @param {Number} day 
 * @returns 
 */
function buildDateStr(year, month, day) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const year = toYear(getRouterParam(event, 'year'))
  const query = getQuery(event);

  const countryCode = query.countrycode || 'TWN'

  const HLD = await ReadHLD(year, countryCode);

  const flags = [];

  for (let mm = 0; mm < 12; mm++) {
    const shift = mm * 31;
    for (let dd = 0; dd < 31; dd++) {
      const flag = HLD[shift+dd]

      if(flag && !['N', ' '].includes(flag)) {
        flags.push( { date: buildDateStr(year, mm+1, dd+1), mark: flag })
      }
    }
  }

  return flags
})
