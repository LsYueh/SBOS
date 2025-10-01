<template>
  <div class="container py-3">
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="角色管理">
        <i class="fa-solid fa-users" />
      </button>
      <button class="btn btn-success" @click="openModal()">
        <i class="fas fa-user-plus me-1" /> 新增使用者
      </button>
    </div>

    <!-- 使用者表格 -->
    <View ref="viewTLB" ajax-url="/api/users" :columns="columns" />

    <!-- 使用者表單 Modal -->
    <div id="userModal" ref="userModalRef" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id ? '編輯使用者' : '新增使用者' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">帳號</label>
                <input v-model="form.account" type="text" class="form-control" :disabled="!!form.id" required>
              </div>
              <div class="mb-3">
                <label class="form-label">角色</label>
                <select v-model="form.role_title" class="form-select" :disabled="roleIsDisabled" required>
                  <option v-for="role in roles" :key="role.id" :value="role.title">{{ role.description }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">姓名</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">說明</label>
                <input v-model="form.description" type="text" class="form-control">
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

const roleIsDisabled = computed(() => form.account === user.username)

// 表單資料
const form = reactive({
  created_by: '',
  created_at: null,
  modified_by: '',
  updated_at: null,
  deleted_at: null,

  id: null,
  account: '',
  name: '',
  description: '',

  role_id: '',
  role_title: '',
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
  { title: '角色'    , field: 'role_title', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5,
    formatter: (cell) => {
      const role_title = cell.getValue()
      return roles.value.find((role) => role.title === role_title)?.description ?? '(未知)'
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
    }
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
    Object.assign(form, user)
  } else {
    resetForm()
  }
  userModal.show()
}

// 儲存（新增/更新）
async function saveUser() {
  try {
    form.modified_by = user.username
    form.role_id = roles.value.find((role) => role.title === form.role_title)?.id

    if (form.id) {
      const _r = await $fetch(`/api/users/${form.id}`, { method: 'PUT', body: { ...form } })
      showToast('使用者更新成功', 'success')
    } else {
      form.created_by = user.username

      const _r = await $fetch('/api/users', { method: 'POST', body: { ...form } })
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
    form.modified_by = user.username
    const statusTo = deleted_at ? 'Y' : 'N'
    const _r = await $fetch(`/api/users/${id}/alter`, { method: 'POST', body: { status: statusTo, ...form } })
    viewTLB.value.refresh()
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

// 重設表單
function resetForm() {
  form.created_by = ''
  form.created_at = null
  form.modified_by = ''
  form.updated_at = null
  form.deleted_at = null

  form.id = null
  form.account = ''
  form.name = ''
  form.description = ''

  form.role_id = ''
  form.role_title = 'user'
}
</script>

<style scoped>
</style>
