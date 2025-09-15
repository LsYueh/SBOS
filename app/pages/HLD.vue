<template>
<div class="calendar-container">
  <div class="controls">
    <button class="btn" @click="prevYear">
        <i class="fas fa-chevron-left"/>
      </button>

      <span class="year-label">{{ currentYear }} 年</span>

      <button class="btn" @click="nextYear">
        <i class="fas fa-chevron-right"/>
      </button>
  </div>

  <VCalendar
    ref="calendar"
    v-model="calendarDate"
    :rows="3"
    :columns="4"
    :min-date="new Date(currentYear, 0, 1)"
    :max-date="new Date(currentYear, 11, 31)"
    :attributes="attributes"
    @dayclick="onDayClick"
  />
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { $bootstrap, $dayjs } = useNuxtApp()

/**------+---------+---------+---------+---------+---------+---------+----------
 * Page Meta
---------+---------+---------+---------+---------+---------+---------+--------*/

definePageMeta({
  headerTitle: '假日設定 (HLD)'
})

/**------+---------+---------+---------+---------+---------+---------+----------
 * VCalendar
---------+---------+---------+---------+---------+---------+---------+--------*/

const calendar = ref(null);
const calendarDate = ref(new Date())
const currentYear = computed(() => calendarDate.value.getFullYear())

/** 日期屬性 */
const attributes = ref([])

/** 日期集合 */
const selectedDates = ref(new Set())

/**------+---------+---------+---------+---------+---------+---------+----------
 * Helper
---------+---------+---------+---------+---------+---------+---------+--------*/

/**
 * @param {String} dateKey 
 * @param {Date} date 
 */
function addCalendarAttr(dateKey, date) {
  selectedDates.value.add(dateKey)

  attributes.value.push({
    key: `selected-${dateKey}`,
    highlight: { color: 'red', fillMode: 'solid' },
    dates: date,
    popover: { label: `假日` }
  })
}

/**
 * @param {String} dateKey 
 */
function deleteCalendarAttr(dateKey) {
  selectedDates.value.delete(dateKey)

  attributes.value = attributes.value.filter(attr => {
    if (!attr.key.startsWith('selected-')) return true
    return $dayjs(attr.dates).format('YYYY-MM-DD') !== dateKey
  })
}

/**
 * @param year 
 */
async function loadCalendar(year) {
  const HLD = await $fetch(`/api/HLD/${year}`)

  // 清空
  attributes.value.length = 0

  HLD.forEach((hld) => {
    const dateKey = hld.date;

    selectedDates.value.add(dateKey)

    // TODO: 根據旗標切換highlight與popover.label

    attributes.value.push({
      key: `selected-${dateKey}`,
      // content: 'red',
      highlight: { color: 'red', fillMode: 'solid' },
      dates: $dayjs(hld.date).toDate(),
      popover: { label: `假日` }
    })
  })

  // 今天標記
  attributes.value.push({
    key: 'today',
    bar: true,
    dates: new Date()
  })
}

/**------+---------+---------+---------+---------+---------+---------+----------
 * Events
---------+---------+---------+---------+---------+---------+---------+--------*/

onMounted(async () => {
  await loadCalendar(currentYear)
})

async function prevYear() {
  calendarDate.value = new Date(currentYear.value - 1, 0, 1)
  await loadCalendar(currentYear.value)
  await calendar.value.move(new Date(currentYear.value, 0, 1))
}

async function nextYear() {
  calendarDate.value = new Date(currentYear.value + 1, 0, 1)
  await loadCalendar(currentYear.value)
  await calendar.value.move(new Date(currentYear.value, 0, 1))
}

/**
 * @param day CalendarDay
 * @param event MouseEvent
 */
function onDayClick(day, event) {
  const d = $dayjs(day.date)
  const dateKey = d.format('YYYY-MM-DD');

  if (!selectedDates.value.has(dateKey)) {
    addCalendarAttr(dateKey, d.toDate())
  } else {
    deleteCalendarAttr(dateKey)
  }
}
</script>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
}

.btn:hover {
  color: #007bff;
}

.year-label {
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
