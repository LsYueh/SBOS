import { defineNuxtPlugin } from '#app'

import * as bootstrap from 'bootstrap'

export default defineNuxtPlugin(() => {
    return {
      provide: {
        bootstrap
      }
    }
})
