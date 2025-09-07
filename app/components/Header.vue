<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore()

// 時鐘
const clock = ref('')
let timer = null
function updateClock() {
  const now = new Date()
  clock.value = now.toLocaleTimeString('zh-TW', { hour12: true })
}

function handleLogout() {
  user.logout()
  router.push('/')
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 500)
})

onUnmounted(() => {
  clearInterval(timer)
})

</script>

<template>
  <header class="bg-primary text-white py-2 mb-4">
    <div class="container d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-building me-1"/> 證券帳務
      </h5>

      <div class="position-absolute start-50 translate-middle-x">
        {{ clock }}
      </div>

      <!-- 登出 -->
      <div v-if="user.isLoggedIn" class="d-flex align-items-center">
        <span>
          <i class="fas fa-user me-1"/>
        </span>
        <span class="me-2">{{ user.username }}</span>
        <span title="登出" style="cursor: pointer;" @click="handleLogout">
          <i class="fas fa-sign-out-alt me-1"/>
        </span>
      </div>

    </div>
  </header>
</template>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
