<template>
  <FullCalendar :options="calendarOptions" style="z-index: 0" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: koLocale,
  headerToolbar: {
    start: 'title',
    center: '',
    end: 'today prev,next',
  },
  titleFormat: { year: 'numeric', month: 'long' },
  events: [],
  dateClick: (info) => {
    console.log(info.dateStr);
  },
  dayCellDidMount: (arg) => {
    const day = arg.date.getDay(); // 0:일, 1:월, ..., 6:토
    const dayNumberElement = arg.el.querySelector('.fc-daygrid-day-number');
    dayNumberElement.innerHTML = dayNumberElement.innerHTML.replace('일', '');
    if (dayNumberElement) {
      if (day === 0) {
        dayNumberElement.style.color = 'red'; // 일요일
      } else if (day === 6) {
        dayNumberElement.style.color = 'blue'; // 토요일
      } else {
        dayNumberElement.style.color = 'black'; // 월~금
      }
    }
  },
};
</script>

<style>
/* 일요일 헤더: 빨간색 */
.fc .fc-col-header-cell:nth-child(1) .fc-col-header-cell-cushion {
  color: red !important;
}

/* 월~금 헤더: 검정색 */
.fc .fc-col-header-cell:nth-child(2) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(3) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(4) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(5) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(6) .fc-col-header-cell-cushion {
  color: black !important;
}

/* 토요일 헤더: 파란색 */
.fc .fc-col-header-cell:nth-child(7) .fc-col-header-cell-cushion {
  color: blue !important;
}

/* FullCalendar 버튼 전체 색상 변경 */
.fc .fc-button {
  background-color: #4318d1 !important;
  border-color: #4318d1 !important;
  color: white !important; /* 텍스트는 흰색으로 보이게 */
}

/* 버튼 hover 시 색상 */
.fc .fc-button:hover {
  background-color: #3310a3 !important;
  border-color: #3310a3 !important;
}

.fc-daygrid-day-number,
.fc-col-header-cell-cushion {
  text-decoration: none;
}
</style>
