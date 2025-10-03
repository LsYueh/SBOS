<template>
  <div class="container py-3">
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button class="btn btn-success" @click="openUserModal()">
        <i class="fas fa-user-plus me-1" /> 新增使用者
      </button>
    </div>

    <!-- 使用者表格 -->
    <View ref="viewUsers" ajax-url="/api/users" :columns="columns" />

    <!-- Modal : User -->
    <div ref="userModalRef" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ formUser.id ? '編輯使用者' : '新增使用者' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetFormUser" />
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
              <div class="mb-5">
                <label class="form-label">說明</label>
                <textarea v-model="formUser.description" type="text" class="form-control" rows="3" />
              </div>

              <div class="text-end">
                <button type="submit" class="btn btn-success me-2">儲存</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetFormUser">取消</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : User Roles -->
    <div ref="userRolesModalRef" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">編輯角色</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetFormUserRoles" />
          </div>
          <div class="modal-body">
            <form @submit.prevent="upsertUserRoles">
              <div class="input-group mb-3">
                <span class="input-group-text">
                  <i class="fa-solid fa-users" />
                </span>
                <select v-model="formUserRoles.selectedRoleTitle" class="form-select" :disabled="userIsDisabled" required>
                  <option v-for="role in rolesFromApi" :key="role.id" :value="role.title">{{ role.description }}</option>
                </select>
                <button class="btn btn-success" type="button" @click="addRole">
                  <i class="fa-solid fa-plus" />
                </button>
              </div>
              <div class="mb-5">
                <table class="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>角色</th>
                      <th>建立人員</th>
                      <th>建立時間</th>
                      <th>更新人員</th>
                      <th>更新時間</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(role, index) in formUserRoles.roles" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ role.role_description }}</td>
                      <td>{{ role.created_by }}</td>
                      <td>{{ datetimeFormatter(role.created_at) }}</td>
                      <td>{{ role.modified_by }}</td>
                      <td>{{ datetimeFormatter(role.updated_at) }}</td>
                      <td>
                        <i v-if="!roleIsDisabled" class="fa-solid fa-trash-can text-danger" style="cursor:pointer;" @click="removeRole(index)" />
                        <i v-else class="fa-solid fa-trash-can" style="cursor:not-allowed; opacity:0.5;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="text-end">
                <button v-if="!roleIsDisabled" type="submit" class="btn btn-success me-2">儲存</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetFormUserRoles">離開</button>
              </div>
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

let userRolesModal = null
const userRolesModalRef = ref(null)

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** 角色清單 (from API) */
const rolesFromApi = ref([])

const userIsDisabled = computed(() => formUser.account === user.username)
const roleIsDisabled = computed(() => formUserRoles._account === user.username)

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

const formUserRoles = reactive({
  user_id: null,
  roles: [],

  selectedRoleTitle: 'user',
  _account: '',
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/** YYYY/MM/DD HH:mm */
function datetimeFormatter(v) {
  return v ? $dayjs(v).format('YYYY/MM/DD HH:mm') : '----/--/-- --:--:--'
}

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
      const view = cell.getData()
      openUserModal(view)
    }
  },
  { title: '帳號'    , field: 'account'  , headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5 },
  { title: '姓名'    , field: 'name'      , headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5 },
  { title: '說明'    , field: 'description', headerHozAlign: 'center', headerSort:false, },
  { title: '建立時間', field: 'created_at', headerHozAlign: 'center', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
  { title: '更新時間', field: 'updated_at', headerHozAlign: 'center', headerSort:false, widthGrow: 0.5, formatter: (cell) => datetimeFormatter(cell.getValue()), },
  { title: '角色'    , field: 'role_count', headerHozAlign: 'center', hozAlign: 'center', headerSort:false, widthGrow: 0.5,
    formatter: (cell) => {
      const view = cell.getData()
      const roleCount = view.role_count

      return `<i class="fa-solid ${roleCount > 0 ? 'fa-users' : 'fa-users-slash'} text-primary" style="cursor:pointer;" />`
    },
    cellClick: async (e, cell) => {
      const view = cell.getData()
      openUserRolesModal(view)
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

const viewUsers = ref(null)

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

  if (userRolesModalRef.value) {
    userRolesModal = new $bootstrap.Modal(userRolesModalRef.value, { backdrop: 'static' })
  }

  rolesFromApi.value = await $fetch('/api/roles')
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : Users
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param user 
 */
function openUserModal(user = null) {
  if (user) {
    Object.assign(formUser, user)
  } else {
    resetFormUser()
  }
  userModal.show()
}

/**
 * 
 */
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

    resetFormUser()
    viewUsers.value.refresh()
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
    viewUsers.value.refresh()
  } catch (err) {
    showToast(`變更失敗: ${err}`, 'danger')
  }
}

/**
 * 
 */
function resetFormUser() {
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

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events : User Roles
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param user 
 */
async function openUserRolesModal(user = null) {
  if (!user?.id) alert('缺少使用者資料')

  formUserRoles.user_id = user.id 
  formUserRoles._account = user.account

  try {
    formUserRoles.roles = await $fetch(`/api/users/${user.id}/roles`)
    userRolesModal.show()
  } catch (err) {
    showToast(`角色讀取失敗: ${err}`, 'danger')
  }
}

/**
 * 
 */
async function upsertUserRoles() {
  const id = formUserRoles.user_id

  try {
    const res = await $fetch(`/api/users/${id}/roles`, { method: 'POST', body: [ ...formUserRoles.roles ] })
    showToast(`角色更新成功 ${res.affectedRows} 筆`, 'success')
    formUserRoles.roles = await $fetch(`/api/users/${id}/roles`)
    viewUsers.value.refresh()
  } catch (err) {
    showToast(`角色儲存失敗: ${err}`, 'danger')
  }
}

/**
 * 
 */
function resetFormUserRoles() {
  formUserRoles.user_id = null
  formUserRoles.roles = []

  formUserRoles.selectedRoleTitle = 'user'
  formUserRoles._account = ''
}

/**
 * 新增角色
 */
function addRole() {
  const title = formUserRoles.selectedRoleTitle
  if (title === '') {
    showToast('請選擇角色', 'danger')
    return
  }

  const role = rolesFromApi.value.find((v) => v.title === title)
  if (!role) {
    showToast(`角色'${title}'不存在於資料庫中`, 'danger')
    return
  }

  const exists = formUserRoles.roles.some((v) => v.role_title === title)
  if (exists) {
    showToast('角色已重複', 'danger')
    return
  }

  formUserRoles.roles.push({
    created_by: user.username,
    created_at: null,
    modified_by: user.username,
    updated_at: null,

    role_id: role.id,
    role_title: title,
    role_description: role.description,
  })
}

/**
 * 刪除角色
 * @param index 
 */
function removeRole(index) {
  formUserRoles.roles.splice(index, 1)
}

</script>

<style scoped>
</style>
