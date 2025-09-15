import { defineNuxtPlugin } from '#app'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VCalendar, {
    // 全域設定
    componentPrefix: 'V', // 預設元件前綴 <VDatePicker /> / <VCalendar />
  })
})
