<template>
  <div class="container py-3">
    <form @submit.prevent="upsertResource">
      <div class="row gx-3 mb-3">
        <!-- 左側：KEY + 資源 -->
        <div class="col">
          <div class="input-group mb-2">
            <span class="input-group-text">KEY</span>
            <input v-model="formResource.key" type="text" class="form-control" readonly disabled>
          </div>
          <div class="input-group">
            <span class="input-group-text">URL</span>
            <input v-model="formResource.resource" type="text" class="form-control" placeholder='ex: "/admin/dashboard"' required @keyup="onResourceKeyup">
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
            <button type="button" class="btn btn-secondary" title="清除" data-bs-toggle="tooltip" @click="resetFormResource"><i class="fa-solid fa-arrow-rotate-left"/></button>
          </div>
        </div>

        <div class="col-auto">
          <div class="d-grid mx-auto h-100">
            <button type="submit" class="btn btn-success" title="儲存" data-bs-toggle="tooltip"><i class="fa-solid fa-square-check"/></button>
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
import Table from '~/components/Table.vue';
const { $bootstrap, $dayjs } = useNuxtApp();

const user = useUserStore();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '權限資源設定'
});

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
const formResource = reactive({
  created_by : '',
  created_at : null,
  modified_by: '',
  updated_at : null,
  deleted_at : null,

  id: null,
  key: '',
  description: '',
  resource: '',
  action: '',
});

const tableRef = ref(null);

const tableOptions = {
  pagination: true,
  paginationSize: 5
};

const tableColumns = [
  { title: 'KEY', field: 'key', widthGrow: 0.5 },
  { title: 'URL', field: 'resource' },
  { title: '建立時間', field: 'created_at', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
  { title: '更新時間', field: 'updated_at', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
  { title: '權限', field: 'action', hozAlign: 'right',
    formatter: (cell) => {
      const action = cell.getValue();
      return action
    },
  },
  {
    title: '狀態'    , field: 'deleted_at', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.3,
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
      const deletedAt = view.deleted_at

      // 重新啟用的時候不警告，不然太擾民了
      if (!deletedAt && !confirm('確定要停用這個資源嗎？')) return

      await alterResource(view.id, view.deleted_at)
    },
  }
];

let timer = null;

/**------+---------+---------+---------+---------+---------+---------+----------
 * Variables : Permissions
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Permission option */
const options = ['查詢', '新增', '修改', '刪除', '下載', '製表'];
const checked = ref(Array(options.length).fill(false))

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

/** YYYY/MM/DD HH:mm */
function datetimeFormatter(v) {
  return v ? $dayjs(v).format('YYYY/MM/DD HH:mm') : '----/--/-- --:--:--'
}

/**
 * (Factory function)
 * @param param
 */
function createUrlTagger({ prefix = 'PAGE', suffix = 'VIEW', ignore = ['ADMIN', 'USER', 'APP', 'API'] } = {}) {
  return function(url) {
    if (!url) return `${prefix}_HOME_${suffix}`;

    url = url.split(/[?#]/)[0];
    const parts = url.split('/').filter(Boolean).map(p => p.trim().toUpperCase());

    while (parts.length && ignore.includes(parts[0])) parts.shift();

    const tagBody = parts.length ? parts.join('_') : 'HOME';

    return `${prefix}_${tagBody}_${suffix}`;
  };
}

const $TAG = createUrlTagger();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  initBs5Tooltips()
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Resource Input/Edit
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
function onResourceKeyup() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    formResource.key = formResource.resource ? $TAG(formResource.resource) : ''
  }, 500); // 500ms 延遲
}

/**
 * 
 */
function resetFormResource() {
  formResource.created_by  = ''
  formResource.created_at  = null
  formResource.modified_by = ''
  formResource.updated_at  = null
  formResource.deleted_at  = null

  formResource.id = null
  formResource.key = ''
  formResource.description = ''
  formResource.resource = ''
  formResource.action = ''

  setPermissionOptions()
}

/**
 * @returns 
 */
async function loadResources() {
  const data = await $fetch('/api/permissions');

  return data
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
async function upsertResource() {
  try {
    formResource.modified_by = user.username;
    formResource.action = bitValue.value;

    if (formResource.id) {
      const _r = await $fetch(`/api/permissions/${formResource.id}`, { method: 'PUT', body: { ...formResource } });
      showToast(`URL:'${formResource.resource}' 更新成功`, 'success')
    } else {
      formResource.created_by = user.username;

      const _r = await $fetch('/api/permissions', { method: 'POST', body: { ...formResource } });
      showToast(`URL:'${formResource.resource}' 新增成功`, 'success')
    }

    resetFormResource()
    reloadTable()
  } catch (error) {
    showToast(`異動失敗: ${error}`, 'danger')
  }
}

/**
 * @param id 
 * @param deleted_at 
 */
async function alterResource(id, deleted_at) {
  try {
    formResource.modified_by = user.username
    const statusTo = deleted_at ? 'Y' : 'N'
    const _r = await $fetch(`/api/permissions/${id}/alter`, { method: 'POST', body: { status: statusTo, ...formResource } })
    
    reloadTable()
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Table
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * 
 */
async function reloadTable() {
  const _data = await loadResources();
  tableRef.value.setData(_data)
}

/**
 * 
 */
async function onTableReady() {
  reloadTable()
}

/**
 * 
 * @param rowData 
 */
function handleRowClick(rowData) {
  if (rowData) {
    Object.assign(formResource, rowData);
    setPermissionOptions(formResource.action)
  }
}

</script>

<style scoped>
</style>