<template>
  <div class="container py-3">
    <form @submit.prevent="handleUpload">
      <div class="row mb-3">
        <div class="col-md-3">
          <div class="input-group">
            <span class="input-group-text" for="transactionDate">交易日期</span>
            <input id="transactionDate" v-model="transactionDate" type="date" class="form-control" :readonly="isReadonly">
            <button type="button" class="btn btn-outline-secondary" @click="toggleReadonly">
              <i :class="isReadonly ? 'fas fa-lock' : 'fas fa-unlock'" />
            </button>
            <!-- '啟用錯帳模式' : '錯帳模式已啟用' -->
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

    <View ref="viewMHOK" ajax-url="/api/MHOK" :columns="columns" />

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
            <pre>{{ message }}</pre>
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
import { onMounted, ref } from 'vue'
import View from '~/components/View.vue'
const { $bootstrap, $dayjs } = useNuxtApp();

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '交易所成交回報上傳 (MHOK)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** 交易日期 */
const transactionDate = ref($dayjs().format('YYYY-MM-DD'))
const isReadonly = ref(true)

/** 檔案 */
const file = ref(null)
const fileInput = ref(null)
const isUploading = ref(false)

/** Tabulator */
const columns = [
  { title: '#', formatter: 'rownum', hozAlign: 'center', widthGrow: 0.2, headerSort:false, },
  { title: '委託書編號', field: 'OrderNo' },
  { title: '證券代號', field: 'StkNo' },
  { title: '數量', field: 'MthQty', widthGrow: 0.5, headerSort:false,  },
  { title: '價格', field: 'MthPr', formatter:"money", },
  { title: '時間', field: 'MthTime', formatter: (cell) => $dayjs(cell.getValue()).format('HH:mm:ss.SSS'), },
  { title: '交易類別', field: 'ExCd', widthGrow: 0.7, headerSort:false, formatter: (cell) => cell.getValue() === '0' ? '整股' : '零股' , },
  { title: 'B/S', field: 'BuySell', widthGrow: 0.5, headerSort:false,  },
  { title: '帳號', field: '_Account_', headerSort:false, mutator:function(value, data){
    return `${data.BrokerId}-${data.IVAcNo}`
  }},
  { title: '委託類別', field: 'OdrTpe', widthGrow: 0.7, headerSort:false, formatter: function(cell) {
    const OdrTpe = cell.getValue();
    switch (OdrTpe) {
      case '0': return '一般'
      case '1': return '融資(證)'
      case '2': return '融券(證)'
      case '3': return '融資(自)'
      case '4': return '融券(自)'
      case '5': return '券賣(5)'
      case '6': return '券賣(6)'
      default: return `${OdrTpe}`
    }
  }},
  { title: '流水號', field: 'SeqNo', headerHozAlign: 'center', hozAlign: 'center', },
  // { title: '成交總檔編號', field: 'RecNo', },
  // { title: '補送註記', field: 'MarkS', },
  {
    title: '', hozAlign: 'center', widthGrow: 0.3, headerSort:false,
    formatter: () => {
      return '<i class="fas fa-trash text-danger" style="cursor:pointer;" />'
    },
    cellClick: async (e, cell) => {
      const rowData = cell.getData()

      if (!confirm(`確定刪除 委託書 ${rowData.OrderNo} ?`)) return


      try {
        const response = await $fetch(`/api/MHOK`, {
          method: "DELETE",
          body: {
            MthTime : rowData.MthTime,
            BrokerId: rowData.BrokerId,
            RecNo   : rowData.RecNo,
          }
        })

        alert(`異動資料${response.affectedRows}筆: ${response.message}`)
      } catch (err) {
        alert("刪除失敗: " + err)
      } finally {
        viewMHOK.value.refresh()
      }
    }
  },
]

const viewMHOK = ref(null)

/** @type {import('bootstrap').Modal | null} Modal */
let modalInstance = null
const modalRef = ref(null)
const message = ref('')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  if (modalRef.value) {
    modalInstance = new $bootstrap.Modal(modalRef.value, { backdrop: 'static' })
  }
})

function toggleReadonly() {
  isReadonly.value = !isReadonly.value
}

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
    showModal(res.success ? `已上傳${res.affectedRows ?? -1}筆資料\n${res.message}` : '上傳失敗')

    // 上傳成功後清空欄位
    file.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    viewMHOK.value.refresh()
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
