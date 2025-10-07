<template>
  <div ref="tableRef"/>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  options: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['row-click'])

const tableRef = ref(null)
let tableInstance = null

onMounted(() => {
  tableInstance = new Tabulator(tableRef.value, {
    data: props.data,
    columns: props.columns,
    layout: 'fitColumns',
    responsiveLayout: true,
    placeholder: '目前沒有資料',
    ...props.options
  })

  tableInstance.on('rowClick', function(e, row){
    const rowData = row.getData()
    emit('row-click', rowData)
  });
})

watch(() => props.data,
  (newData) => {
    if (tableInstance) tableInstance.replaceData(newData)
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (tableInstance) {
    tableInstance.destroy()
    tableInstance = null
  }
})

defineExpose({ tableInstance })
</script>

<style scoped>
.tabulator {
  font-size: 0.9rem;
  border-radius: 0.5rem;
}
</style>
