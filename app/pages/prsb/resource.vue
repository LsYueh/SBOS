<template>
  <div class="container py-3">
      <form @submit.prevent="addResource">
        <div class="row gx-3 mb-3">
          <!-- 左側：KEY + 資源 -->
          <div class="col">
            <div class="input-group mb-2">
              <span class="input-group-text">KEY</span>
              <input v-model="formResource.key" type="text" class="form-control" readonly disabled>
            </div>
            <div class="input-group">
              <span class="input-group-text">URL</span>
              <input v-model="formResource.resource" type="text" class="form-control" placeholder='ex: "/admin/dashboard"' required>
              <button type="button" class="btn btn-secondary" title="檢查" data-bs-toggle="tooltip" @click="checkResource"><i class="fa-solid fa-clipboard-check"/></button>
            </div>
          </div>

          <!-- 右側：說明 -->
          <div class="col d-flex">
            <div class="input-group">
              <span class="input-group-text">說明</span>
              <textarea v-model="formResource.description" class="form-control" placeholder="輸入說明..." />
            </div>
          </div>
        </div>

        <!-- 權限 -->
        <div class="row gx-2 mb-3">
          <div class="col">
            <div class="input-group">
              <span class="input-group-text">權限</span>
              <div class="input-group-text p-0 flex-grow-1">
                <table class="table table-sm text-center mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>查詢</th>
                      <th>新增</th>
                      <th>修改</th>
                      <th>刪除</th>
                      <th>下載</th>
                      <th>製表</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <div class="form-check form-switch"><input class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
                        </div>
                      </td>
                    </tr>                
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-auto">
            <div class="d-grid mx-auto h-100">
              <button type="button" class="btn btn-secondary" title="清除" data-bs-toggle="tooltip" @click="resetFormResource"><i class="fa-solid fa-arrow-rotate-left"/></button>
            </div>
          </div>

          <div class="col-auto">
            <div class="d-grid mx-auto h-100">
              <button type="submit" class="btn btn-success" title="儲存" data-bs-toggle="tooltip" @click="saveResource"><i class="fa-solid fa-square-check"/></button>
            </div>
          </div>
        </div>
      </form>

      <div class="input-group mb-2">
        <span class="input-group-text">資源</span>
        <div class="input-group-text p-0 flex-grow-1">
          <Table ref="tableRef" class="w-100" :columns="tableColumns" :options="tableOptions" @ready="onTableReady" @row-click="handleRowClick"/>
        </div>
      </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted  } from 'vue'
import Table from '~/components/Table.vue'
const { $bootstrap } = useNuxtApp();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '權限資源設定'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables
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

const tableRef = ref(null)

const tableOptions = {
  pagination: true,
  paginationSize: 5
}

const tableColumns = [
  { title: 'KEY', field: 'key', widthGrow: 0.5 },
  { title: 'URL', field: 'resource' },
  { title: '權限', field: 'action', hozAlign: 'right', }
]


/**------+---------+---------+---------+---------+---------+---------+----------
 * Tooltips
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * Initialize tooltips
 */
function initBs5Tooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new $bootstrap.Tooltip(tooltipTriggerEl))

  return tooltipList
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  initBs5Tooltips()
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events - Resource Input/Edit
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
function resetFormResource() {
  formResource.created_by =  ''
  formResource.created_at =  null
  formResource.modified_by =  ''
  formResource.updated_at =  null
  formResource.deleted_at =  null

  formResource.id =  null
  formResource.key =  ''
  formResource.description =  ''
  formResource.resource =  ''
  formResource.action =  ''
}

/**
 * @returns 
 */
async function loadResources() {
  // TODO: ...

  return [
    { key: 'KEY_0001_PAGE', description: '', resource: '/page1/aaa', action: 'READ' },
    { key: 'KEY_0002_PAGE', description: null, resource: '/page1/bbb', action: 'READ, WRITE' },
    { key: 'KEY_0003_PAGE', description: '', resource: '/report/fin', action: 'PRINT' }
  ]
}

/**
 * 
 */
async function checkResource() {
  // TODO: ...
}

/**
 * 
 */
async function addResource() {
  // TODO: ...
}

/**
 * 
 */
async function saveResource() {
  // TODO: ...
}


/**------+---------+---------+---------+---------+---------+---------+----------
 * Events - Table
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function onTableReady() {
  const _data = await loadResources()
  tableRef.value.setData(_data)
}

/**
 * 
 * @param rowData 
 */
function handleRowClick(rowData) {
  if (rowData) Object.assign(formResource, rowData)
}

</script>

<style scoped>
</style>