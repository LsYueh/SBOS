<template>
  <div class="w-100" style="max-width: 400px;">
    <div class="card shadow-sm p-4" style="width: 380px;">
      <h3 class="text-center mb-4">
        <i class="fas fa-user-shield"/> 登入
      </h3>

      <form @submit.prevent="submitLogin" @keydown.enter="submitLogin">
        <!-- 帳號 -->
        <div class="mb-3">
          <label for="username" class="form-label">
            <i class="fas fa-user"/> 帳號
          </label>
          <input id="username" v-model="username" type="text" class="form-control"
            placeholder="輸入帳號" required >
        </div>

        <!-- 密碼 -->
        <div class="mb-3">
          <label for="password" class="form-label">
            <i class="fas fa-lock"/> 密碼
          </label>
          <div class="position-relative">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control"
              placeholder="輸入密碼" required >
            <span class="position-absolute top-50 end-0 translate-middle-y pe-3" style="cursor: pointer;" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"/>
            </span>
          </div>
          <!-- <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-control"
              placeholder="輸入密碼" required />
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div> -->
        </div>

        <div class="d-flex justify-content-between mt-3">
          <span style="cursor: pointer;" @click="clearForm">
            <i class="fas fa-eraser"/> 清除
          </span>
          <a href="#" class="text-decoration-none">
            <i class="fas fa-question-circle"/> 忘記密碼
          </a>
        </div>

        <button type="submit" class="btn btn-primary w-100 mt-5">
          <i class="fas fa-sign-in-alt"/> 登入
        </button>
      </form>

      <div v-if="errorMsg" class="alert alert-danger mt-3" role="alert">
        {{ errorMsg }}
      </div>
    </div>

    <p class="text-center mt-1 text-muted">
      <small>v{{ config.public.appVersion }} (#{{ config.public.gitHash }})</small>
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const router = useRouter()

const user = useUserStore()

const username = ref('') // AD 帳號
const password = ref('')
const showPassword = ref(false) // 是否顯示密碼
const errorMsg = ref('')

watch(errorMsg, (val) => {
  if (val) {
    setTimeout(() => {
      errorMsg.value = ''
    }, 3000)
  }
})

/**
 * 簡單驗證 Windows AD 帳號格式
 * @param value 
 */
function validateADUsername(value) {
  // 支援 DOMAIN\username 或 username@domain.com
  const domainBackslash = /^[^\\]+\\[^\\]+$/
  const domainAt = /^[^@]+@[^@]+\.[^@]+$/
  return domainBackslash.test(value) || domainAt.test(value)
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

function clearForm() {
  username.value = ''
  password.value = ''
  errorMsg.value = ''
}

async function submitLogin() {
  if (!username.value || !password.value) {
    errorMsg.value = '請填寫 AD 帳號與密碼'
    return
  }

  // Note: 看情況使用
  // if (!validateADUsername(username.value)) {
  //   errorMsg.value = '請輸入有效的 AD 帳號格式 (DOMAIN\\username 或 username@domain.com)'
  //   return
  // }

  try {
    await user.login(username.value, password.value)

    // 登入成功，導向 Dashboard
    router.push('/dashboard')
  } catch (err) { // H3Error
    errorMsg.value = err.statusMessage
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
