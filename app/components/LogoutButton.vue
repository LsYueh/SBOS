<template>
  <!-- 可切換樣式: link 或 button -->
  <component :is="props.tag" :class="props.cssClass" @click="handleLogout">
    {{ props.label }}
  </component>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  label: { type: String, default: '登出' },
  tag: { type: String, default: 'button' }, // 'button' 或 'a'
  cssClass: { type: String, default: 'btn btn-link nav-link' } // 可自定義樣式
})

const router = useRouter()
const user = useUserStore()

function handleLogout() {
  user.logout()
  router.push('/')
}
</script>
