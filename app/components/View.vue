<template>
  <div ref="table" class="tabulator" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'

const user = useUserStore();

const props = defineProps({
  ajaxUrl: { type: String, required: true }, // 改成從父層傳 API URL
  columns: { type: Array, required: true },
});

const emit = defineEmits(['row-click']);

const table = ref(null);
let tabulatorInstance = null;

watch(() => props.ajaxUrl, (newUrl) => {
  if (tabulatorInstance) {
    tabulatorInstance.setData(newUrl) // 重新載入資料
  }
})

onMounted(() => {
  const headers = user.token ? {
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  } : {}
  
  tabulatorInstance = new Tabulator(table.value, {
    ajaxURL: props.ajaxUrl,
    ajaxConfig: { headers, },
    pagination: true,
    paginationMode: 'remote',
    paginationSize: 10,
    paginationSizeSelector:[10, 25, 50, 100],
    columns: props.columns,
    layout: 'fitColumns',
  });

  tabulatorInstance.on('rowClick', function(e, row){
    const rowData = row.getData()
    emit('row-click', rowData)
  });
})

onBeforeUnmount(() => {
  if (tabulatorInstance) {
    tabulatorInstance.destroy();
    tabulatorInstance = null;
  }
})

defineExpose({
  refresh() {
    if (tabulatorInstance) tabulatorInstance.setData();
  }
})
</script>
