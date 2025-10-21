// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

/**------+---------+---------+---------+---------+---------+---------+----------
 * Version
---------+---------+---------+---------+---------+---------+---------+--------*/

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

/**------+---------+---------+---------+---------+---------+---------+----------
 * .env
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * Server-Side Config
 * @returns 
 */
function serverSideConfigFactory() {
  // JWT
  const jwt = {
    jwtSecret: process.env.JWT_SECRET || 'default_secret',
  };

  // POSTGRES
  const postgres = {
    dbHost: process.env.POSTGRES_HOST     || 'localhost',
    dbPort: process.env.POSTGRES_DB_PORT  ? Number(process.env.DB_PORT) : 5432,
    dbUser: process.env.POSTGRES_USER     || 'sbos-db-user',
    dbPass: process.env.POSTGRES_PASSWORD || 'db-passwd',
    dbName: process.env.POSTGRES_DB       || 'postgres',
  };

  const _config = {
    ...jwt, ...postgres,
  }

  return _config
}

/**
 * Client-Side Config
 * @returns 
 */
function publicConfigFactory() {
  const _config = {
    appVersion, gitHash
  }

  return _config  
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Nuxt Config
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineNuxtConfig({
  runtimeConfig: {
    ...serverSideConfigFactory(),
    public: publicConfigFactory()
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  sourcemap: true,

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'
  ],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
  ]
})