<template>
  <div class="container py-3">

    <!-- Toast 提示 -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div ref="toastRef" class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="2000">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted  } from 'vue';
const { $bootstrap, $dayjs } = useNuxtApp();

const user = useUserStore();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '權限管理 (PRSB)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables : Permissions
---------+---------+---------+---------+---------+---------+---------+--------*/

/** @type {string[]} Permission option */
const options = PERMISSION_OPTIONS;
const checked = ref(Array(options.length).fill(false));

/**
 * BitSet
 */
const bitValue = computed(() => {
  // 計算 BitSet 整數
  return checked.value.reduce((acc, val, idx) => {
    if (val) acc |= (1 << idx)
    return acc
  }, 0)
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Toast
---------+---------+---------+---------+---------+---------+---------+--------*/

const toastRef = ref(null);
let toastInstance = null;
const toastMessage = ref('');

const showToast = (msg, type = 'primary') => {
  toastMessage.value = msg;
  toastRef.value.className = `toast align-items-center text-bg-${type} border-0`;
  toastInstance = toastInstance || new $bootstrap.Toast(toastRef.value, { delay: 2000 });
  toastInstance.show();
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tooltips
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * Initialize tooltips
 */
function initBs5Tooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new $bootstrap.Tooltip(tooltipTriggerEl));

  return tooltipList;
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  initBs5Tooltips();
});

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Permission Input/Edit
---------+---------+---------+---------+---------+---------+---------+--------*/

</script>

<style scoped>
</style>