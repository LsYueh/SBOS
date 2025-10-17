<template>
  <div class="container py-3">
    <form @submit.prevent="addPermission">
      <div class="row gx-2 mb-3 align-items-center">
        <!-- 左側：角色 -->
        <div class="col">
          <div class="input-group mb-2">
            <div class="input-group-text p-0 flex-grow-1">
              <Table ref="tableRolesRef" class="w-100" :columns="tableRoles.columns" :options="tableRoles.options"
                @row-selected="handleRoleRowSelected"
                @row-deselected="handleRoleRowDeselected"
                @ready="onTableRolesReady"
              />
            </div>
            <span class="input-group-text">角色</span>
          </div>
        </div>

        <div class="col-auto">
          <i class="fa-solid fa-plus"/>
        </div>

        <!-- 左側：資源 -->
        <div class="col">
          <div class="input-group mb-2">
            <span class="input-group-text">資源</span>
            <div class="input-group-text p-0 flex-grow-1">
              <Table ref="tableResRef" class="w-100" :columns="tableRes.columns" :options="tableRes.options"
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
              <Table ref="tablePrsbRef" class="w-100" :columns="tablePrsb.columns" :options="tablePrsb.options"
                @row-selected="handlePrsbRowSelected"
                @row-deselected="handlePrsbRowDeselected"
                @ready="onTablePrsbReady"
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
  headerTitle: '權限管理 (PRSB)',
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables : Data Models
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Role */
const mRole = reactive({
  id: null,
  description: '',
});

/** Resource */
const mRes = reactive({
  id: null,
  resource: '',
});

/** Permission */
const mPrsb = reactive({
  created_by : '',
  created_at : null,
  modified_by: '',
  updated_at : null,
  deleted_at : null,

  role_id    : null,
  resource_id: null,
  action     : '',
});

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables : Table/View
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Default Table Options */
const defaultTableOptions = {
  height:"311px",
  layout:"fitColumns",
  columnDefaults:{
    headerHozAlign: 'center',
    headerSort: false,
    hozAlign: 'center',
    resizable: false,
  },
  selectableRows: 1,
  selectableRowsPersistence: false, // disable selection persistence
  pagination: true,
  paginationSize: 5,
}

/** Roles */
const tableRolesRef = ref(null)
const tableRoles = {
  columns: [
    { title: 'Key', field: 'title' },
    { title: '角色', field: 'description', widthGrow: 0.5, headerFilter:"input", },
  ],
  options: { ...defaultTableOptions },
}

/** Resources */
const tableResRef = ref(null)
const tableRes = {
  columns: [
    { title: ' ', widthGrow: 0.1, },
    { title: 'URL', field: 'resource', hozAlign: 'left', headerFilter:"input", },
    { title: '說明', field: 'description', widthGrow: 0.5, },
  ],
  options:  { ...defaultTableOptions },
}

/** Permissions */
const tablePrsbRef = ref(null)
const tablePrsb = {
  columns: [
    { title: 'URL', field: 'resource', hozAlign: 'left', headerFilter:"input", },
    { title: '建立時間', field: 'created_at', widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
    { title: '更新時間', field: 'updated_at', widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
    { title: '權限', field: 'action', hozAlign: 'right', headerSort: true,
      formatter: (cell) => {
        const action = cell.getValue();
        return action;
      },
    },
    {
      title: '狀態', field: 'deleted_at', widthGrow: 0.3,
      formatter: (cell) => {
        const view = cell.getData();
        const deletedAt = view.deleted_at;

        const opacity = 0.5;

        if (deletedAt) {
          cell.getRow().getElement().style.opacity = opacity;
        }

        const textColor = deletedAt ? 'text-danger' : 'text-success';
        
        return `<i class="fas ${deletedAt ? 'fa-ban' : 'fa-circle-check'} ${textColor}" style="cursor:context-menu};" />`
      },
      cellClick: async (e, cell) => {
        const PRSB = cell.getData();

        await alterPermission(PRSB.role_id, PRSB.resource_id, PRSB.deleted_at);

        showToast(`URL:'${PRSB.resource}' 權限更新成功`, 'success');
      },
    }
  ],
  options:  { ...defaultTableOptions },
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
    if (val) acc |= (1 << idx);
    return acc;
  }, 0);
})

/**
 * 設定 checkbox 狀態
 * @param {number} [bitValue] 
 */
function setPermissionOptions(bitValue = 0) {
  const num = Number(bitValue);
  const safeValue = Number.isFinite(num) ? num : 0;

  checked.value = checked.value.map((_, idx) => !!(safeValue & (1 << idx)));
}

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

/**
 * UUIDv1 檢查
 * @param {string} str 
 * @returns 
 */
function isUUIDv1(str = '') {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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
 * @description Table 的 `row-deselected` 事件會連動 `Data Model` 的清除行為
 */
function resetFormPermission() {
  tableRolesRef.value.deselectAll();
    tableResRef.value.deselectAll();
   tablePrsbRef.value.deselectAll();

  setPermissionOptions();
}

/**
 * 
 */
async function addPermission() {
  if (!isUUIDv1(mRole.id) || !isUUIDv1(mRes.id)) { showToast(`請選擇好角色與資源`, 'danger'); return; }

  try {
    mPrsb.modified_by = user.username;
    mPrsb.action = bitValue.value;

    if (mPrsb.role_id) {
      const _r = await $fetch(`/api/permissions/${mPrsb.role_id}`, { method: 'PUT', body: { ...mPrsb } });
      showToast(`角色:'${mRole.description}' URL:'${mRes.resource}' 更新成功`, 'success');
    } else {
      mPrsb.created_by = user.username;
      mPrsb.role_id = mRole.id;
      mPrsb.resource_id = mRes.id;

      const _r = await $fetch(`/api/permissions/${mPrsb.role_id}`, { method: 'POST', body: { ...mPrsb } });
      showToast(`角色:'${mRole.description}' URL:'${mRes.resource}' 新增成功`, 'success');
    }

    resetFormPermission();
    reloadTablePrsb();
  } catch (error) {
    showToast(`異動失敗: ${error}`, 'danger');
  }
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Roles
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTableRoles() {
  const _data = await $fetch('/api/roles');
  tableRolesRef.value.setData(_data);
}

/**
 * 
 * @param role 
 */
async function handleRoleRowSelected(role) {
  if (role) {
    mRole.id = role.id;
    mRole.description = role.description;

    const _data = await $fetch(`/api/permissions/${role.id}`);
    tablePrsbRef.value.setData(_data);
  }
}

/**
 * 
 * @param role 
 */
function handleRoleRowDeselected(role) {
  if (role) {
    mRole.id = null;
    mRole.description = '';

    tableResRef.value.deselectAll();
    tablePrsbRef.value.deselectAll();

    tablePrsbRef.value.setData([]);
  }
}

/**
 * 
 */
async function onTableRolesReady() {
  reloadTableRoles();
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Resources
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTableRes() {
  const _data = await $fetch('/api/resources');
  tableResRef.value.setData(_data);
}

/**
 * 
 * @param res 
 */
function handleResRowSelected(res) {
  if (res) {
    mRes.id = res.id;
    mRes.resource = res.resource;
  }
}

/**
 * 
 * @param res 
 */
function handleResRowDeselected(res) {
  if (res) {
    mRes.id = null;
    mRes.resource = '';
  }
}

/**
 * 
 */
async function onTableResReady() {
  reloadTableRes();
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table Permissions (PRSB)
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTablePrsb() {
  const _data = [];
  tablePrsbRef.value.setData(_data);
}

/**
 * 
 * @param permission 
 */
function handlePrsbRowSelected(permission) {
  if (permission) {
    Object.assign(mPrsb, permission);

    tableResRef.value.deselectAll();
  }
}

/**
 * 
 * @param permission 
 */
function handlePrsbRowDeselected(permission) {
  if (permission) {
    resetModelPrsb();

    tableResRef.value.deselectAll();
  }
}

/**
 * 
 */
async function onTablePrsbReady() {
  reloadTablePrsb();
}

/**
 * @param role_id 
 * @param resource_id 
 * @param deleted_at 
 */
async function alterPermission(role_id, resource_id, deleted_at) {
  try {
    mPrsb.modified_by = user.username;
    const statusTo = deleted_at ? 'Y' : 'N';
    const _r = await $fetch(`/api/permissions/${role_id}/alter`, { method: 'POST', body: { status: statusTo, ...mPrsb } })

    reloadTablePrsb();
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger');
  }
}

/**
 * 
 */
function resetModelPrsb() {
  mPrsb.created_at  = null;
  mPrsb.modified_by = '';
  mPrsb.updated_at  = null;
  mPrsb.deleted_at  = null;

  mPrsb.role_id     = null;
  mPrsb.resource_id = null;
  mPrsb.action      = '';
}

</script>

<style scoped>
.tabulator {
  font-size: 0.9rem;
  border-radius: 0.5rem;
}
</style>