<template>
  <div class="container py-5">
    <div class="row mb-3">
      <div class="col-md-3">
        <div class="input-group">
          <span class="input-group-text" for="transactionDate">交易日期</span>
          <input id="transactionDate" v-model="transactionDate" type="date" class="form-control" readonly="true">
        </div>
      </div>
    </div>

    <View ref="viewMHIO" ajax-url="/api/MHIO" :columns="columns" />
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
  headerTitle: '成交回報匯總資料 (MHIO)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * 
---------+---------+---------+---------+---------+---------+---------+--------*/

/** 交易日期 */
const transactionDate = ref($dayjs().format('YYYY-MM-DD'))

/** Tabulator */
const columns = [
  { title: '#', formatter: 'rownum', hozAlign: 'center', widthGrow: 0.2, headerSort:false, },
]

const viewMHIO = ref(null)

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  
})

</script>

<style scoped>
</style>