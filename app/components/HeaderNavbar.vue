<script setup>
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

function handleLogout() {
  user.logout()
  router.push('/login')
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <!-- Logo / Brand -->
        <NuxtLink to="/" class="navbar-brand">證券帳務</NuxtLink>

        <!-- 漢堡選單 -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarHeader"
          aria-controls="navbarHeader"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"/>
        </button>

        <!-- Navbar 內容 -->
        <div id="navbarHeader" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <NuxtLink to="/" class="nav-link">首頁</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
            </li>
          </ul>

          <!-- 登入狀態 / 登出按鈕 -->
          <div v-if="user.isLoggedIn" class="d-flex align-items-center">
            <span class="me-3 text-white">Hi, {{ user.username }}</span>
            <button class="btn btn-outline-light btn-sm" @click="handleLogout">
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* 可選微調 */
.navbar-brand {
  font-weight: bold;
}
</style>
