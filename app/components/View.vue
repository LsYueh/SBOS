<template>
  <div ref="table" class="tabulator" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'

const props = defineProps({
  ajaxUrl: { type: String, required: true }, // 改成從父層傳 API URL
  columns: { type: Array, required: true },
})

const table = ref(null)
let tabulatorInstance = null

onMounted(() => {
  tabulatorInstance = new Tabulator(table.value, {
    ajaxURL: props.ajaxUrl,
    ajaxURLGenerator: (url, config, params) => {
      // Tabulator 內建 params 包含 page, size, sorters
      const page = params.page || 1
      const size = params.size || 10
      const sortField = params.sorters?.[0]?.field || ''
      const sortDir = params.sorters?.[0]?.dir || ''

      // 拼接 Query
      const query = new URLSearchParams({
        page,
        size,
        sortField,
        sortDir
      })
      return `${url}?${query.toString()}`
    },
    ajaxResponse: (url, params, response) => {
      // API 回傳 { data, last_page }
      return response.data
    },
    pagination: 'remote',
    paginationSize: 10,
    paginationSizeSelector:[10, 25, 50, 100],
    paginationDataSent: {
      page: 'page', // 從 Tabulator 傳給 API
      size: 'size'
    },
    paginationDataReceived: {
      last_page: 'last_page' // API 回傳的總頁數
    },
    columns: props.columns,
    layout: 'fitColumns',
  })
})

onBeforeUnmount(() => {
  if (tabulatorInstance) {
    tabulatorInstance.destroy()
    tabulatorInstance = null
  }
})

defineExpose({
  refresh() {
    if (tabulatorInstance) tabulatorInstance.setData()
  }
})
</script>
