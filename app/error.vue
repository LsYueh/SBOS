<template>
  <div class="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-4">
    <div class="card shadow-sm p-4" style="max-width: 480px;">
      <h1 class="display-4 fw-bold">{{ props.error.statusCode || 'Error' }}</h1>
      <p class="lead mb-4">{{ message }}</p>

      <div class="d-flex gap-3 justify-content-center">
        <button class="btn btn-primary" @click="goHome">
          回首頁
        </button>
        <button class="btn btn-outline-secondary" @click="goBack">
          上一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  error: NuxtError
}>()

const router = useRouter()

const goHome = () => router.push('/')

const goBack = () => {
  // 如果沒有上一頁，就回首頁，避免停在錯誤頁
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const message = computed(() => {
  const status = props.error.statusCode || 500
  switch (status) {
    case 404:
      return '您要瀏覽的頁面不存在或已被移除'
    case 403:
      return '您沒有權限存取此頁面'
    case 500:
      return '伺服器發生錯誤，請稍後再試'
    default:
      return props.error.message || '發生未知錯誤'
  }
})
</script>
