<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: [
    // { title: '회의', date: '2025-04-06' },
    // { title: '프로젝트 마감', date: '2025-04-10' },
  ],
  dateClick: (info) => {
    console.log(info.dateStr); // 클릭한 날짜 (예: 2025-04-06)
  },
};
</script>
