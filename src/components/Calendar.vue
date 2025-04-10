<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const transactionStore = useTransactionStore();

const calendarEvents = ref([]);

const dailyTotals = computed(() => {
  const totals = {};

  for (const tx of transactionStore.transactions) {
    const date = tx.date;

    if (!totals[date]) {
      totals[date] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      totals[date].income += tx.amount;
    } else if (tx.type === 'expense') {
      totals[date].expense += tx.amount;
    }
  }

  return totals;
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: koLocale,
  events: calendarEvents,
  dayCellContent: (arg) => {
    const dateStr = dayjs(arg.date).format('YYYY-MM-DD');
    const totals = dailyTotals.value[dateStr];
    const day = arg.date.getDate();

    let html = `<div class="day-number">${day}</div><br/>`;
    if (totals) {
      if (totals.expense)
        html += `<div class="dayCellAmount expense">- ${totals.expense.toLocaleString()}원</div>`;
      if (totals.income)
        html += `<div class='dayCellAmount income'>+ ${totals.income.toLocaleString()}원</div>`;

      const todayTotal = totals.income - totals.expense;
      const sign = todayTotal > 0 ? '+' : '';
      const totalClass = todayTotal > 0 ? 'plus' : 'minus';
      html += `<div class='dayCellAmount tototal ${totalClass}'>${sign}${todayTotal.toLocaleString()}원</div>`;
    }

    return { html };
  },

  headerToolbar: {
    start: 'title',
    center: '',
    end: 'today prev,next',
  },
  dateClick: (info) => {
    console.log('날짜 클릭:', info.dateStr);
  },
  titleFormat: { year: 'numeric', month: 'long' },

  events: [],

  dayCellDidMount: (arg) => {
    const day = arg.date.getDay(); // 0:일, 1:월, ..., 6:토
    const dayNumberElement = arg.el.querySelector('.fc-daygrid-day-number');
    dayNumberElement.innerHTML = dayNumberElement.innerHTML.replace('일', '');
    if (dayNumberElement) {
      if (day === 0) {
        dayNumberElement.style.color = 'red';
      } else if (day === 6) {
        dayNumberElement.style.color = 'blue';
      } else {
        dayNumberElement.style.color = 'black'; // 월~금
      }
    }
  },
});

onMounted(async () => {
  const userId = userStore.user?.id || localStorage.getItem('userId');
  if (!userId) return;

  await transactionStore.fetchByUser(userId);
});
</script>

<style>
.fc-daygrid-day-frame {
  position: relative;
}
.day-number {
  position: absolute;
  top: 4px;
  right: 4px;
  font-weight: bold;
  font-size: 0.85em;
}

.dayCellAmount {
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tototal {
  font-size: 0.8em;
  /* color: gray; */
}

.tototal.plus {
  color: rgb(0, 185, 68);
}

.tototal.minus {
  color: rgb(255, 174, 1);
}

.dayCellAmount.expense {
  color: red;
}

.dayCellAmount.income {
  color: rgb(0, 0, 255);
}

/* 헤더 고정 (2025년 4월, 버튼 등) */
.fc .fc-toolbar {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

/* 요일 행 고정 (일~토) */
.fc .fc-scrollgrid thead {
  position: sticky;
  /* top: 48px; 필요시 값 조정 */
  background-color: white;
  z-index: 9;
}

.calendar-wrapper {
  height: 100%;
  overflow-y: auto; /* 💡 필요 시 추가 */
}

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

/* 캘린더 셀 높이 제한 */
.fc .fc-daygrid-day-frame {
  height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

/* 👉 반응형 처리 */
@media (max-width: 768px) {
  .fc-daygrid-day-frame {
    position: relative;
  }
  .day-number {
    position: absolute;
    top: 4px;
    right: 4px;
    font-weight: normal;
    font-size: 10px;
  }

  .dayCellAmount {
    font-size: 9px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
  }

  .tototal {
    font-size: 8.5px;
    font-weight: 600;
    /* color: gray; */
  }

  .tototal.plus {
    color: rgb(0, 185, 68);
  }

  .tototal.minus {
    color: rgb(255, 174, 1);
  }

  .calendar-wrapper {
    height: 100%;
    overflow-y: auto; /* 💡 필요 시 추가 */
  }

  /* 일요일 헤더: 빨간색 */
  .fc .fc-col-header-cell:nth-child(1) .fc-col-header-cell-cushion {
    color: red !important;
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

  /* 캘린더 셀 높이 제한 */
  .fc .fc-daygrid-day-frame {
    height: 60px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
}
</style>
