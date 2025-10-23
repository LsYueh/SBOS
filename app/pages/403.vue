<template>
  <div class="d-flex flex-column justify-content-center align-items-center min-vh-100">
    <h1 class="display-4 fw-bold mb-3">403</h1>
    <p class="fs-5 mb-4">您沒有權限存取此頁面</p>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" @click="goHome">返回首頁</button>
      <button class="btn btn-outline-secondary" @click="goBack">返回上一頁</button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  auth: false
});

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

function goHome() {
  navigateTo('/');
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    navigateTo('/');
  }
}
</script>
