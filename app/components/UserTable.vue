<script setup>
import { onMounted, ref } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'

const table = ref(null)

onMounted(() => {
  if (table.value) {
    new Tabulator(table.value, {
      data: [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 }
      ],
      columns: [
        { title: 'ID', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age' }
      ],
      layout: 'fitColumns'
    })
  }
})
</script>

<template>
  <div>
    <h1><i class="fas fa-table"/> User Table</h1>
    <table ref="table" class="table-bordered"/>
  </div>
</template>
