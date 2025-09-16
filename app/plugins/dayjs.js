import { defineNuxtPlugin } from '#app'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 預設用台北時區
dayjs.tz.setDefault("Asia/Taipei")

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs
    }
  }
})