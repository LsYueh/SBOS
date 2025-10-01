import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { WriteHLD } from '../../dal/HLD'

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

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const year = toYear(getRouterParam(event, 'year'))
  const body = await readBody(event)

  const countryCode = body.countrycode || 'TWN'
  const flagSet = body.flagSet

  const HLD = await WriteHLD(year, flagSet, countryCode);

  return HLD
})
