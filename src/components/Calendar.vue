<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import dayjs from 'dayjs';
import { ref, onMounted, watch, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const transactionStore = useTransactionStore();

// ✅ FullCalendar ref
const calendarRef = ref(null);

// ✅ 거래 내역을 날짜별로 합산
const dailyTotals = computed(() => {
  const totals = {};
  for (const tx of transactionStore.transactions) {
    const date = tx.date;

    if (!totals[date]) {
      totals[date] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      totals[date].income += Number(tx.amount);
    } else if (tx.type === 'expense') {
      totals[date].expense += Number(tx.amount);
    }
  }
  return totals;
});

// ✅ 캘린더 옵션
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: koLocale,
  events: [],
  headerToolbar: {
    start: 'title',
    center: '',
    end: 'today prev,next',
  },
  titleFormat: { year: 'numeric', month: 'long' },

  dateClick: (info) => {
    console.log('날짜 클릭:', info.dateStr);
  },

  // ✅ 날짜 셀 내용 구성
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
    start: "title",
    center: "",
    end: "today prev,next",
  },
  dateClick: (info) => {
    console.log('날짜 클릭:', info.dateStr);
  },
  titleFormat: { year: 'numeric', month: 'long' },

  events: [],

  dayCellDidMount: (arg) => {
    const day = arg.date.getDay(); // 0:일, 1:월, ..., 6:토
    const dayNumberElement = arg.el.querySelector(".fc-daygrid-day-number");
    dayNumberElement.innerHTML = dayNumberElement.innerHTML.replace("일", "");
    if (dayNumberElement) {
      if (day === 0) {
        dayNumberElement.style.color = "red"; // 일요일
      } else if (day === 6) {
        dayNumberElement.style.color = "blue"; // 토요일
      } else {
        dayNumberElement.style.color = "black"; // 월~금
      }
    }
  },
});

// ✅ 거래내역 반응형 감지 후 다시 그리기
watch(
  () => transactionStore.transactions,
  (newVal) => {
    console.log('📦 거래 내역:', newVal); // 🔍 확인용
    calendarRef.value?.getApi()?.render();
  }
);

// ✅ 초기 데이터 불러오기
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

/* 헤더 고정 */
.fc .fc-toolbar {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

/* 요일 행 고정 */
.fc .fc-scrollgrid thead {
  position: sticky;
  background-color: white;
  z-index: 9;
}

.fc .fc-button {
  background-color: #4318d1 !important;
  border-color: #4318d1 !important;
  color: white !important;
}

.fc .fc-button:hover {
  background-color: #3310a3 !important;
  border-color: #3310a3 !important;
}

.fc-daygrid-day-number,
.fc-col-header-cell-cushion {
  text-decoration: none;
}

.fc .fc-daygrid-day-frame {
  height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

@media (max-width: 768px) {
  .fc .fc-daygrid-day-frame {
    height: 60px;
  }

  .day-number {
    font-size: 10px;
  }

  .dayCellAmount {
    font-size: 9px;
  }

  .tototal {
    font-size: 8.5px;
  }
}
</style>
