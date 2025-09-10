// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

// 讀取 package.json
const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))
const appVersion = packageJson.version || '0.0.0'

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (err) {
    console.warn('無法取得 git commit hash', err)
    return 'unknown'
  }
})();

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appVersion, gitHash
    }
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  sourcemap: true,

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'
  ],

  modules: ['@pinia/nuxt']
})