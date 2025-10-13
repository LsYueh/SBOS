<template>
  <div class="container py-3">
    <form @submit.prevent="addPermission">
      <div class="row gx-2 mb-3">
        <!-- 左側：角色 -->
        <div class="col">
          <div class="input-group mb-2">
            <div class="input-group-text p-0 flex-grow-1">
              <Table ref="tableRolesRef" class="w-100" :columns="tableRoles.columns" :options="tableRoles.options"
                @row-click="handleRoleRowClick"
                @row-selected="handleRoleRowSelected"
                @row-deselected="handleRoleRowDeselected"
                @ready="onTableRolesReady"
              />
            </div>
            <span class="input-group-text">角色</span>
          </div>
        </div>

        <!-- 左側：資源 -->
        <div class="col">
          <div class="input-group mb-2">
            <span class="input-group-text">資源</span>
            <div class="input-group-text p-0 flex-grow-1">
              <Table ref="tableResRef" class="w-100" :columns="tableRes.columns" :options="tableRes.options"
                @row-click="handleResRowClick"
                @row-selected="handleResRowSelected"
                @row-deselected="handleResRowDeselected"
                @ready="onTableResReady"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row gx-2 mb-3">
        <!-- 操作 -->
        <div class="col">
          <div class="input-group">
            <span class="input-group-text">操作</span>
            <div class="input-group-text p-0 flex-grow-1">
              <table class="table table-sm text-center mb-0">
                <thead class="table-light">
                  <tr>
                    <th v-for="(item, index) in options" :key="index">{{ item }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="(item, index) in options" :key="index">
                      <div class="d-flex justify-content-center">
                        <div class="form-check form-switch"><input v-model="checked[index]" class="form-check-input" type="checkbox" value="" aria-label="..." switch></div>
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
            <button type="button" class="btn btn-secondary" title="清除" data-bs-toggle="tooltip" @click="resetFormPermission"><i class="fa-solid fa-arrow-rotate-left"/></button>
          </div>
        </div>

        <div class="col-auto">
          <div class="d-grid mx-auto h-100">
            <button type="submit" class="btn btn-success" title="儲存" data-bs-toggle="tooltip"><i class="fa-solid fa-square-check"/></button>
          </div>
        </div>
      </div>

      <!-- 權限 (PRSB) -->
      <div class="row gx-2 mb-3">
        <div class="col">
          <div class="input-group mb-2">
            <span class="input-group-text">權限</span>
            <div class="input-group-text p-0 flex-grow-1">
              <Table ref="tablePermissionsRef" class="w-100" :columns="tablePermissions.columns" :options="tablePermissions.options"
                @row-click="handlePermissionRowClick"
                @row-selected="handlePermissionRowSelected"
                @row-deselected="handlePermissionRowDeselected"
                @ready="onTablePermissionsReady"
              />
            </div>
          </div>
        </div>
      </div>
    </form>

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
const { $bootstrap } = useNuxtApp();

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

const defaultTableOptions = {
  height:"311px",
  layout:"fitColumns",
  selectableRows: 1,
  selectableRowsPersistence:false, // disable selection persistence
  pagination: true,
  paginationSize: 5
}

/** Roles */
const tableRolesRef = ref(null)
const tableRoles = {
  columns: [
    { title: 'Key', field: 'title', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, },
    { title: '角色', field: 'description', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5, headerFilter:"input", },
  ],
  options: { ...defaultTableOptions }
}

/** Resources */
const tableResRef = ref(null)
const tableRes = {
  columns: [
    { title: ' ', widthGrow: 0.1, headerSort:false, },
    { title: 'URL', field: 'resource', headerHozAlign: 'center', headerSort:false, headerFilter:"input", },
    { title: '說明', field: 'description', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5, },
  ],
  options:  { ...defaultTableOptions }
}

/** Permissions */
const tablePermissionsRef = ref(null)
const tablePermissions = {
  columns: [
    { title: 'URL', field: 'resource', headerHozAlign: 'center', headerSort:false, headerFilter:"input", },
    { title: '建立時間', field: 'created_at', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
    { title: '更新時間', field: 'updated_at', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
    { title: '權限', field: 'action', hozAlign: 'right',
      formatter: (cell) => {
        const action = cell.getValue();
        return action
      },
    },
    {
      title: '狀態', field: 'deleted_at', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.3,
      formatter: (cell) => {
        const view = cell.getData()
        const deletedAt = view.deleted_at

        const opacity = 0.5

        if (deletedAt) {
          cell.getRow().getElement().style.opacity = opacity
        }

        const textColor = deletedAt ? 'text-danger' : 'text-success';
        
        return `<i class="fas ${deletedAt ? 'fa-ban' : 'fa-circle-check'} ${textColor}" style="cursor:context-menu};" />`
      },
      cellClick: async (e, cell) => {
        const view = cell.getData()

        await alterPermission(view.id, view.deleted_at)

        showToast(`URL:'${view.resource}' 權限更新成功`, 'success')
      },
    }
  ],
  options:  { ...defaultTableOptions }
}

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
 * Events : Permissions Input/Edit
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function resetFormPermission() {

}

/**
 * 
 */
async function addPermission() {

}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Roles
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTableRoles() {
  const _data = await $fetch('/api/roles');
  tableRolesRef.value.setData(_data)
}

/**
 * 
 * @param rowData 
 */
function handleRoleRowClick(rowData) {
  // TODO: ...
}

/**
 * 
 * @param rowData 
 */
function handleRoleRowSelected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 * @param rowData 
 */
function handleRoleRowDeselected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 */
async function onTableRolesReady() {
  reloadTableRoles()
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Resources
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTableRes() {
  const _data = await $fetch('/api/resources');
  tableResRef.value.setData(_data)
}

/**
 * 
 * @param rowData 
 */
function handleResRowClick(rowData) {
  // TODO: ...
}

/**
 * 
 * @param rowData 
 */
function handleResRowSelected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 * @param rowData 
 */
function handleResRowDeselected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 */
async function onTableResReady() {
  reloadTableRes()
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Permissions
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTablePermissions() {
  const _data = []
  tableResRef.value.setData(_data)
}

/**
 * 
 * @param rowData 
 */
function handlePermissionRowClick(rowData) {
  // TODO: ...
}

/**
 * 
 * @param rowData 
 */
function handlePermissionRowSelected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 * @param rowData 
 */
function handlePermissionRowDeselected(rowData) {
  // TODO: ...
  console.log(rowData)
}

/**
 * 
 */
async function onTablePermissionsReady() {
  reloadTablePermissions()
}

/**
 * @param id 
 * @param deleted_at 
 */
async function alterPermission(id, deleted_at) {
  try {
    const statusTo = deleted_at ? 'Y' : 'N';

    // TODO: ...
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

</script>

<style scoped>
.tabulator {
  font-size: 0.9rem;
  border-radius: 0.5rem;
}
</style>