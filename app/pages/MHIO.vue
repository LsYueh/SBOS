<template>
  <div class="container py-3">
    <div class="row mb-3">
      <div class="col-md-3">
        <div class="input-group">
          <span class="input-group-text" for="transactionDate">交易日期</span>
          <input id="transactionDate" v-model="transactionDate" type="date" class="form-control" readonly="true">
        </div>
      </div>
    </div>

    <View ref="viewMHIO" ajax-url="/api/MHIO" :columns="columnsMHIO" @row-click="handleRowClick" />

    <br>
    
    <View ref="viewMHOK" :ajax-url="apiUrl" :columns="columnsMHOK" />

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
  headerTitle: '成交明細匯總 (MHIO)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** 交易日期 */
const transactionDate = ref($dayjs().format('YYYY-MM-DD'))

/** Tabulator */
const viewMHIO = ref(null)
const viewMHOK = ref(null)

const columnsMHIO = [
  { title: '#', formatter: 'rownum', headerHozAlign: 'center', hozAlign: 'center', widthGrow: 0.3, headerSort:false, },
  { title: '委託書編號', field: 'OrderNo' },
  { title: '證券代號', field: 'StkNo' },
  { title: '數量', field: 'MthQty', widthGrow: 0.5, headerSort:false,  },
  { title: '價格', field: 'MthPr', formatter: 'money', formatterParams: {
    negativeSign: true,
    precision: 4,
  }},
  { title: '交易類別', field: 'ExCd', widthGrow: 0.7, headerSort:false, formatter: (cell) => {
    switch (cell.getValue()) {
      case '0': return `<span>整股</span>`;
      case '2': return `<span class="text-success">零股</span>`;
      default: return `${cell.getValue()}`
    }
  }},
  { title: 'B/S', field: 'BuySell', widthGrow: 0.5, headerSort:false, formatter: (cell) => {
    switch (cell.getValue()) {
      case 'B': return `<span class="badge bg-danger">買</span>`;
      case 'S': return `<span class="badge bg-success">賣</span>`;
      default: return `<span class="badge bg-info">${cell.getValue()}</span>`
    }
  }},
  { title: '帳號', field: '_Account_', headerSort:false, mutator:function(value, data){
    return `${data.BrokerId}-${data.IVAcNo}`
  }},
  { title: '委託類別', field: 'OdrTpe', widthGrow: 0.7, headerSort:false, formatter: function(cell) {
    switch (cell.getValue()) {
      case '0': return '一般'
      case '1': return '融資(證)'
      case '2': return '融券(證)'
      case '3': return '融資(自)'
      case '4': return '融券(自)'
      case '5': return '券賣(5)'
      case '6': return '券賣(6)'
      default: return `${cell.getValue()}`
    }
  }},
]

const columnsMHOK = [
  { title: '#', formatter: 'rownum', headerHozAlign: 'center', hozAlign: 'center', widthGrow: 0.3, headerSort:false, },
  { title: '數量', field: 'MthQty', widthGrow: 0.5, headerSort:false,  },
  { title: '價格', field: 'MthPr', formatter: 'money', formatterParams: {
    negativeSign: true,
    precision: 4,
  }},
  { title: '時間', field: 'MthTime', formatter: (cell) => $dayjs(cell.getValue()).format('HH:mm:ss.SSS'), },
  { title: '流水號', field: 'SeqNo', widthGrow: 0.8, headerHozAlign: 'center', hozAlign: 'center', },
]

const apiUrl = ref('')

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  
})

function handleRowClick(rowData) {
  const OrderNo = rowData.OrderNo
  apiUrl.value = `/api/MHOK/${OrderNo}`
  viewMHOK.value.refresh()
}

</script>

<style scoped>
</style>