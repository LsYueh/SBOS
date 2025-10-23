<template>
  <UserLogin />
</template>

<script setup>
import UserLogin from '~/components/UserLogin.vue';

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  auth: false,
  headerTitle: null
});

</script>

<style scoped>
</style>