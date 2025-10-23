<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <!-- 主內容，自動撐滿剩餘空間 -->
    <main class="flex-fill d-flex w-100" :class="mainClass">
      <NuxtPage class="w-100" />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';

const route = useRoute();

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

// 動態變更主內容的class
const mainClass = computed(() => {
  return route.path === '/'
    ? 'justify-content-center align-items-center'
    : 'flex-column';
});
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
