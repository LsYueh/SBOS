<template>
  <div class="container py-3">
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-success" @click="openModal()">
        <i class="fas fa-user-plus me-1" /> 新增使用者
      </button>
    </div>

    <!-- 使用者表格 -->
    <View ref="viewTLB" ajax-url="/api/users" :columns="columns" />

    <!-- 使用者表單 Modal -->
    <div ref="userModalRef" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ formUser.id ? '編輯使用者' : '新增使用者' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">帳號</label>
                <input v-model="formUser.account" type="text" class="form-control" :disabled="!!formUser.id" required>
              </div>
              <div class="mb-3">
                <label class="form-label">姓名</label>
                <input v-model="formUser.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">說明</label>
                <input v-model="formUser.description" type="text" class="form-control">
              </div>
              <button type="submit" class="btn btn-success me-2">儲存</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">取消</button>
            </form>
          </div>
        </div>
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
import { reactive, ref, onMounted } from 'vue'
import View from '~/components/View.vue'
const { $bootstrap, $dayjs } = useNuxtApp();

const user = useUserStore()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '使用者設定 (TLB)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Toast
---------+---------+---------+---------+---------+---------+---------+--------*/

const toastRef = ref(null)
let toastInstance = null
const toastMessage = ref('')

const showToast = (msg, type = 'primary') => {
  toastMessage.value = msg
  toastRef.value.className = `toast align-items-center text-bg-${type} border-0`
  toastInstance = toastInstance || new $bootstrap.Toast(toastRef.value, { delay: 2000 })
  toastInstance.show()
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Modal
---------+---------+---------+---------+---------+---------+---------+--------*/

let userModal = null
const userModalRef = ref(null)

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** 角色清單 */
const roles = ref([])

const roleIsDisabled = computed(() => formUser.account === user.username)

// 表單資料
const formUser = reactive({
  created_by: '',
  created_at: null,
  modified_by: '',
  updated_at: null,
  deleted_at: null,

  id: null,
  account: '',
  name: '',
  description: '',
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/** YYYY/MM/DD HH:mm */
const datetimeFormatter = (cell) => $dayjs(cell.getValue()).format('YYYY/MM/DD HH:mm')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tabulator
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Tabulator */
const columns = [
  {
    title: '#', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.3,
    formatter: () => {
      return '<i class="fas fa-pen-to-square text-primary" style="cursor:pointer;" />'
    },
    cellClick: async (e, cell) => {
      const TLB = cell.getData()
      openModal(TLB)
    }
  },
  { title: '帳號'    , field: 'account'  , headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5 },
  { title: '姓名'    , field: 'name'      , headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5 },
  { title: '說明'    , field: 'description', headerHozAlign: 'center', headerSort:false, },
  { title: '建立時間', field: 'created_at', headerHozAlign: 'center', headerSort:false, widthGrow: 0.5, formatter: datetimeFormatter, },
  { title: '更新時間', field: 'updated_at', headerHozAlign: 'center', headerSort:false, widthGrow: 0.5, formatter: datetimeFormatter, },
  { title: '角色'    , field: 'role_count', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5,
    formatter: (cell) => {
      const view = cell.getData()
      const roleCount = view.role_count
      const _roleIsDisabled = (view.account === user.username)

      const opacity = 0.5

      // 不可以自己刪除自己
      if (_roleIsDisabled) cell.getElement().style.opacity = opacity

      return `<i class="fa-solid ${roleCount > 0 ? 'fa-users' : 'fa-users-slash'} ${_roleIsDisabled ? '' : 'text-primary'}" style="cursor:${_roleIsDisabled ? 'not-allowed' : 'pointer'};" />`
    },
    cellClick: async (e, cell) => {
      const view = cell.getData()
      const _roleIsDisabled = (view.account === user.username)

      // 不可以自己編輯自己
      if (_roleIsDisabled) return 

      // TODO: 開編輯角色視窗
      confirm('確定要編輯角色嗎？')
    },
  },
  {
    title: '狀態'    , field: 'deleted_at', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.3,
    formatter: (cell) => {
      const view = cell.getData()
      const deletedAt = view.deleted_at
      const _roleIsDisabled = (view.account === user.username)

      const opacity = 0.5

      if (deletedAt) {
        cell.getRow().getElement().style.opacity = opacity
      } else {
        // 不可以自己刪除自己
        if (_roleIsDisabled) cell.getElement().style.opacity = opacity
      }
      
      return `<i class="fas ${deletedAt ? 'fa-eye-slash' : 'fa-eye'}" style="cursor:${_roleIsDisabled ? 'not-allowed' : 'pointer'};" />`
    },
    cellClick: async (e, cell) => {
      const view = cell.getData()
      const deletedAt = view.deleted_at
      const _roleIsDisabled = (view.account === user.username)

      // 不可以自己刪除自己
      if (_roleIsDisabled) return 

      // 重新啟用的時候不警告，不然太擾民了
      if (!deletedAt && !confirm('確定要停用這個使用者嗎？')) return

      // 淡出效果
      // cell.getRow().getElement().style.transition = "opacity 0.5s";
      // cell.getRow().getElement().style.opacity = 0;

      await alterUser(view.id, view.deleted_at)
    },
  },
]

const viewTLB = ref(null)

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new $bootstrap.Tooltip(tooltipTriggerEl))

  if (userModalRef.value) {
    userModal = new $bootstrap.Modal(userModalRef.value, { backdrop: 'static' })
  }

  roles.value = await $fetch('/api/roles')
})

function openModal(user = null) {
  if (user) {
    Object.assign(formUser, user)
  } else {
    resetForm()
  }
  userModal.show()
}

// 儲存（新增/更新）
async function saveUser() {
  try {
    formUser.modified_by = user.username

    if (formUser.id) {
      const _r = await $fetch(`/api/users/${formUser.id}`, { method: 'PUT', body: { ...formUser } })
      showToast('使用者更新成功', 'success')
    } else {
      formUser.created_by = user.username

      const _r = await $fetch('/api/users', { method: 'POST', body: { ...formUser } })
      showToast('使用者新增成功', 'success')
    }

    resetForm()
    viewTLB.value.refresh()
    userModal.hide()
  } catch (err) {
    showToast(`儲存失敗: ${err}`, 'danger')
  }
}

/**
 * @param id 
 * @param deleted_at 
 */
async function alterUser(id, deleted_at) {
  try {
    formUser.modified_by = user.username
    const statusTo = deleted_at ? 'Y' : 'N'
    const _r = await $fetch(`/api/users/${id}/alter`, { method: 'POST', body: { status: statusTo, ...formUser } })
    viewTLB.value.refresh()
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

// 重設表單
function resetForm() {
  formUser.created_by = ''
  formUser.created_at = null
  formUser.modified_by = ''
  formUser.updated_at = null
  formUser.deleted_at = null

  formUser.id = null
  formUser.account = ''
  formUser.name = ''
  formUser.description = ''
}
</script>

<style scoped>
</style>
