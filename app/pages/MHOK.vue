<template>
  <div class="container py-5">
    <h1 class="text-xl font-bold mb-4">交易所成交回報上傳</h1>

    <form class="space-y-4" @submit.prevent="handleUpload">
      <div class="row mb-3">
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text" for="transactionDate">交易日期</span>
            <input id="transactionDate" v-model="transactionDate" type="date" class="form-control">
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <label for="formFile" class="form-label">檔案代號: R3</label>
        <div class="input-group">
          <input id="formFile" ref="fileInput" class="form-control" type="file" @change="onFileChange">
          <button type="submit" class="btn btn-outline-secondary" :disabled="isUploading">
            {{ isUploading ? "上傳中..." : "上傳" }}
          </button>
        </div>
      </div>
    </form>

    <!-- Bootstrap Modal -->
    <div id="messageModal" ref="modalRef" class="modal fade" tabindex="-1"
      aria-labelledby="messageModalLabel" aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="messageModalLabel" class="modal-title">訊息</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
          </div>
          <div class="modal-body">
            {{ message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { $bootstrap } = useNuxtApp();

const transactionDate = ref(new Date().toISOString().split('T')[0])

const file = ref(null)
const fileInput = ref(null)
const isUploading = ref(false)
const message = ref('')

const modalRef = ref(null)

/** @type {import('bootstrap').Modal | null} */
let modalInstance = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new $bootstrap.Modal(modalRef.value, { backdrop: 'static' })
  }
})

function onFileChange(e) {
  file.value = e.target.files[0]
}

function showModal(msg) {
  message.value = msg
  if (modalInstance) {
    modalInstance.show()
  }
}

async function handleUpload() {
  if (!file.value) {
    return showModal('請選擇檔案')
  }

  isUploading.value = true

  const formData = new FormData()
  formData.append('transactionDate', transactionDate.value)
  formData.append('file', file.value)

  try {
    const _r = await fetch('/api/MHOK/upload', {
      method: 'POST',
      body: formData
    })
    const res = await _r.json()
    showModal(res.success ? `已上傳${res.affectedRows ?? -1}筆資料: ${res.message}` : '上傳失敗')

    // 上傳成功後清空欄位
    file.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    showModal('上傳失敗: ' + err)
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
/* 可以根據需要加一些樣式 */
</style>
