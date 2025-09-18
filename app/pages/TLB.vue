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
                <input v-model="form.username" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">姓名</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">角色</label>
                <select v-model="form.role" class="form-select">
                  <option value="user">使用者</option>
                  <option value="admin">管理員</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">狀態</label>
                <select v-model="form.status" class="form-select">
                  <option value="active">啟用</option>
                  <option value="inactive">停用</option>
                </select>
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
const { $bootstrap } = useNuxtApp();

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
  email: '',
  role: 'user',
  status: 'active',
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Tabulator
---------+---------+---------+---------+---------+---------+---------+--------*/

/** Tabulator */
const columns = [
  {
    title: '', hozAlign: 'center', widthGrow: 0.3, headerSort:false,
    formatter: () => {
      return '<i class="fas fa-trash text-danger" style="cursor:pointer;" />'
    },
    cellClick: async (e, cell) => {
      const TLB = cell.getData()
      deleteUser(TLB.id)
    }
  },
  { title: 'ID', field: 'id' },
  { title: '帳號', field: 'username' },
  { title: '姓名', field: 'name' },
  { title: 'Email', field: 'email' },
  { title: '角色', field: 'status', headerSort:false, formatter: (cell) => {
    const status = cell.getValue();
    const bg = (status === 'active') ? 'bg-success' : 'bg-secondary'
    return `<span class="badge ${bg}">${status}</span>`;
  }},
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
      const _r = await $fetch(`/api/TLB/${form.id}`, { method: 'PUT', body: { ...form } })
      showToast('使用者更新成功', 'success')
    } else {
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

// 刪除
async function deleteUser(id) {
  if (!confirm('確定要刪除這個使用者嗎？')) return
  try {
    const _r = await $fetch(`/api/TLB/${id}`, { method: 'DELETE' })
    showToast('刪除成功', 'success')
    viewTLB.value.refresh()
  } catch (err) {
    showToast(`刪除失敗: ${err}`, 'danger')
  }
}

// 重設表單
function resetForm() {
  form.id = null
  form.username = ''
  form.name = ''
  form.email = ''
  form.role = 'user'
  form.status = 'active'
}
</script>

<style scoped>
</style>
