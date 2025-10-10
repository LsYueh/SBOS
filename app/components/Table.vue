<template>
  <div ref="tableRef"/>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, defineExpose, defineEmits } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  options: { type: Object, default: () => ({}) }
});

const emit = defineEmits([
  'row-click', 'row-selected', 'row-deselected',
  'ready'
]);

const tableRef = ref(null);

/** @type {Tabulator} */
let tableInstance = null;

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
    const rowData = row.getData();
    emit('row-click', rowData);
  });

  tableInstance.on("rowSelected", function(row){
      const rowData = row.getData();
      emit('row-selected', rowData);
  });

  tableInstance.on("rowDeselected", function(row){
      const rowData = row.getData();
      emit('row-deselected', rowData);
  });

  tableInstance.on("tableBuilt", function() {
    emit('ready');
  }); 
})

watch(() => props.data,
  (newData) => {
    if (tableInstance) tableInstance.replaceData(newData);
  },
  { deep: true }
)

/**
 * @param newData 
 */
function setData(data = []) {
  if (tableInstance) tableInstance.replaceData(data);
}

onBeforeUnmount(() => {
  if (tableInstance) {
    tableInstance.destroy();
    tableInstance = null;
  }
})

defineExpose({ setData })
</script>

<style scoped>
.tabulator {
  font-size: 0.9rem;
  border-radius: 0.5rem;
}
</style>
