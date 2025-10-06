<template>
  <div class="container py-3">
      <form @submit.prevent="addResource">
        <div class="mb-3">
          <label class="form-label">KEY</label>
          <input v-model="formResource.key" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">資源</label>
          <input v-model="formResource.resource" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">權限</label>
          <input v-model="formResource.action" type="text" class="form-control" required>
        </div>
        <div class="mb-5">
          <label class="form-label">說明</label>
          <textarea v-model="formResource.description" type="text" class="form-control" rows="3" />
        </div>

        <button type="submit" class="btn btn-success me-2">Save</button>
      </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted  } from 'vue'
import View from '~/components/View.vue'
const { $bootstrap } = useNuxtApp();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '權限資源設定'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
const formResource = reactive({
  created_by: '',
  created_at: null,
  modified_by: '',
  updated_at: null,
  deleted_at: null,

  id: null,
  key: '',
  description: '',
  resource: '',
  action: '',
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {

})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
function addResource() {
  
}

</script>

<style scoped>
</style>