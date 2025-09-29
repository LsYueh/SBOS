<template>
  <div class="container py-3">
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-success" @click="openModal()">
        <i class="fas fa-user-plus me-1" /> 新增使用者
      </button>
    </div>

    <!-- 使用者表格 -->
    <View ref="viewTLB" ajax-url="/api/TLB" :columns="columns" />

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
                <input v-model="form.username" type="text" class="form-control" :disabled="!!form.id" required>
              </div>
              <div class="mb-3">
                <label class="form-label">姓名</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">說明</label>
                <input v-model="form.comment" type="text" class="form-control" required>
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

// 表單資料
const form = reactive({
  id: null,
  username: '',
  name: '',
  comment: '',

  created_by: '',
  created_at: null,
  modified_by: '',
  updated_at: null,
  deleted_at: null,
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tabulator
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Tabulator */
const columns = [
  {
    title: '', hozAlign: 'center', widthGrow: 0.3, headerSort:false,
    formatter: () => {
      return '<i class="fas fa-pen-to-square text-primary" style="cursor:pointer;" />'
    },
    cellClick: async (e, cell) => {
      const TLB = cell.getData()
      openModal(TLB)
    }
  },
  { title: '帳號', field: 'username', widthGrow: 0.5 },
  { title: '姓名', field: 'name', widthGrow: 0.5 },
  { title: '說明', field: 'comment' },
  { title: '建立時間', field: 'created_at', widthGrow: 0.5, formatter: (cell) => $dayjs(cell.getValue()).format('YYYY/MM/DD HH:mm'), },
  { title: '更新時間', field: 'updated_at', widthGrow: 0.5, formatter: (cell) => $dayjs(cell.getValue()).format('YYYY/MM/DD HH:mm'), },
  { title: '角色', field: 'role_title', widthGrow: 0.3, headerSort:false },
  {
    title: '狀態', field: 'deleted_at', headerHozAlign: 'center', hozAlign: 'center', widthGrow: 0.3, headerSort:false,
    formatter: (cell) => {
      const deletedAt = cell.getValue()

      if (deletedAt) cell.getRow().getElement().style.opacity = 0.5
      
      return `<i class="fas ${deletedAt ? 'fa-eye-slash' : 'fa-eye'}" style="cursor:pointer;" />`
    },
    cellClick: async (e, cell) => {
      if (!confirm('確定要停用這個使用者嗎？')) return

      // 淡出效果
      // cell.getRow().getElement().style.transition = "opacity 0.5s";
      // cell.getRow().getElement().style.opacity = 0;

      const TLB = cell.getData()
      await alterUser(TLB.id, TLB.deleted_at)
    }
  },
]

const viewTLB = ref(null)

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(() => {
  if (userModalRef.value) {
    userModal = new $bootstrap.Modal(userModalRef.value, { backdrop: 'static' })
  }
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
    if (form.id) {
      form.modified_by = user.username
      const _r = await $fetch(`/api/TLB/${form.id}`, { method: 'PUT', body: { ...form } })
      showToast('使用者更新成功', 'success')
    } else {
      form.created_by = user.username
      form.modified_by = user.username
      const _r = await $fetch('/api/TLB', { method: 'POST', body: { ...form } })
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
    const _r = await $fetch(`/api/TLB/${id}/alter`, { method: 'POST', body: { status: statusTo, ...form } })
    viewTLB.value.refresh()
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

// 重設表單
function resetForm() {
  form.id = null
  form.username = ''
  form.name = ''
  form.comment = ''

  form.created_by = ''
  form.created_at = null
  form.modified_by = ''
  form.updated_at = null
  form.deleted_at = null
}
</script>

<style scoped>
</style>
