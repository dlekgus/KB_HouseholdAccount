<template>
  <div class="container py-4">
    <!-- 기간 선택 -->
    <div class="mb-4 d-flex flex-wrap gap-2">
      <button
        v-for="m in [1, 3, 6, 12]"
        :key="m"
        class="btn"
        :class="period === m ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectPeriod(m)"
      >
        {{ m }}개월
      </button>
    </div>

    <!-- 요약 및 점수 -->
    <div class="row g-4">
      <!-- 전월 대비 카드 -->
      <div class="col-12 col-md-8">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-muted">전 {{ period }}개월 대비</h5>
            <div class="row">
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">총 지출</small>
                <div class="h5">
                  {{
                    !periodStat.total ? 0 : periodStat.total.toLocaleString()
                  }}원
                </div>
                <div class="small" :class="changeRateClass">
                  {{ formattedChangeRate }}
                </div>
              </div>
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">평균 일 지출</small>
                <div class="h5">79,225원</div>
                <div class="small">-15.2%</div>
              </div>
              <div class="col-12 col-md-4">
                <small class="text-muted">최다 지출 항목</small>
                <div class="h5">
                  {{ !periodStat.topCategory ? '' : periodStat.topCategory }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 소비 점수 -->
      <div
        class="col-12 col-md-4 d-flex justify-content-center align-items-center"
      >
        <div class="score-circle text-center">
          <div
            class="circle"
            :style="{
              borderColor: borderColor,
              borderWidth: '10px',
              borderStyle: 'solid',
            }"
          >
            <span class="score" :class="gradeInfo.color">{{ rate }}</span>
          </div>
          <div class="mt-2" :class="gradeInfo.color">
            <div class="fw-bold">{{ gradeInfo.grade }} 등급</div>
            <div class="text-muted">{{ gradeInfo.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 차트 -->
    <div class="row mt-4 g-4">
      <div class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">카테고리별 지출</h6>
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">요일별 지출</h6>
            <canvas ref="weeklyChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive, watch } from 'vue';
import {
  Chart,
  DoughnutController,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import axios from 'axios';

Chart.register(
  DoughnutController,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const categoryChart = ref(null);
const weeklyChart = ref(null);
// ✅ 상태 변수
const period = ref(1);
const periodStat = reactive({ total: 0, topCategory: '' });

watch(period, () => {
  updatePeriodStats();
});
const currentData = ref([]);
const previousData = ref([]);
const changeRate = ref(0);

const state = reactive({ userTransactions: [] });

const userId = 3;
const BASE_URI = '/api/transactions';
// fetch users all data from db
const fetchUserTransactions = async () => {
  try {
    const response = await axios.get(BASE_URI + `?userId=${userId}`);
    if (response.status === 200) {
      state.userTransactions = response.data;
      updatePeriodStats();
      //   calcMonthlySpending(state.userTransactions);
    } else {
      alert('데이터 조회 실패');
    }
  } catch (e) {
    alert('에러 발생');
  }
};

function updatePeriodStats() {
  const stats = getPeriodStats(period.value, state.userTransactions);
  periodStat.total = stats.total;
  periodStat.topCategory = stats.topCategory;
}

//월별 총합 계산 함수
function calcMonthlySpending(transactions) {
  const monthlyTotal = {};
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const month = tx.date.slice(0, 7);
      console.log(month);

      if (!monthlyTotal[month]) {
        monthlyTotal[month] = 0;
      }
      monthlyTotal[month] += tx.amount;
    }
  });

  return monthlyTotal;
}

// period 계산
function getPeriodStats(period, transactions) {
  const now = new Date();
  const prevDate = new Date();
  prevDate.setMonth(now.getMonth() - period);

  console.log(transactions);

  //1. filtering peroid expense
  const filtered = transactions.filter((t) => {
    const txDate = new Date(t.date);
    return t.type === 'expense' && txDate >= prevDate && txDate <= now;
  });

  // 2. calculate total
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  // 3. daily average

  // 4.
  let categoryMap = {};
  filtered.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += t.amount;
  });

  let topCategory = '';
  let max = 0;
  for (const [category, amount] of Object.entries(categoryMap)) {
    if (amount > max) {
      max = amount;
      topCategory = category;
    }
  }

  return {
    total,
    topCategory,
  };
}

function getDataForPeriod(months, isPrevious) {
  const offset = isPrevious ? months : 0;
  return Array.from({ length: months }, () =>
    Math.floor(Math.random() * 20000)
  );
}
// 기간 선택 함수
function selectPeriod(months) {
  period.value = months;
  loadData();
}

const borderColor = computed(() => {
  // color 클래스를 직접 사용하지 않고, 색상 코드로 매핑
  const colorMap = {
    'text-success': '#2e7d32',
    'text-primary': '#1976d2',
    'text-warning': '#fbc02d',
    'text-danger': '#d32f2f',
  };
  return colorMap[gradeInfo.value.color] || '#ccc';
});

const gradeInfo = computed(() => {
  const val = changeRate.value;
  if (val <= 70)
    return { grade: 'A', message: '절약 잘했어요!', color: 'text-success' };
  if (val <= 90)
    return { grade: 'B', message: '양호한 소비입니다.', color: 'text-primary' };
  if (val <= 110)
    return { grade: 'C', message: '주의가 필요해요.', color: 'text-warning' };
  return {
    grade: 'D',
    message: '수입보다 더 많이 썼어요!',
    color: 'text-danger',
  };
});

const formattedChangeRate = computed(() => {
  if (changeRate.value > 0) return `+${changeRate.value.toFixed(1)}%`;
  return `${changeRate.value.toFixed(1)}%`;
});

// 전 N개월 대비 퍼센트
const changeRateClass = computed(() => {
  if (changeRate.value > 0) return 'text-success';
  if (changeRate.value < 0) return 'text-danger';
  return 'text-muted';
});

function getChangeRate(current, prev) {
  const currTotal = current.reduce((a, b) => a + b, 0);
  const prevTotal = prev.reduce((a, b) => a + b, 0);
  const diff = currTotal - prevTotal;
  return (diff / (prevTotal || 1)) * 100; // 숫자만 반환
}
// ✅ 데이터 로드 함수
function loadData() {
  currentData.value = getDataForPeriod(period.value, false);
  previousData.value = getDataForPeriod(period.value, true);
  changeRate.value = getChangeRate(currentData.value, previousData.value);
}
const rate = computed(() => {
  const expense = currentData.value[0];
  const income = previousData.value[0];
  return Math.round((expense / (income || 1)) * 100);
});

onMounted(() => {
  fetchUserTransactions();
  new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: ['식비', '교통', '기타'],
      datasets: [
        {
          data: [56, 30, 25],
          backgroundColor: ['#28a745', '#0d6efd', '#ffc107'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
    },
  });
  new Chart(weeklyChart.value, {
    type: 'bar',
    data: {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [
        {
          label: '지출',
          data: [12000, 15000, 9000, 11000, 17000, 23000, 20000],
          backgroundColor: '#6610f2',
          barThickness: 10,
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<style scoped>
.score-circle .circle {
  width: 100px;
  height: 100px;
  border: 10px solid #385531;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3rem;
}
.score-circle .score {
  font-size: 1.5rem;
  color: #6f42c1;
  font-weight: bold;
}

.border-success {
  border-color: #2e7d32;
}
.border-primary {
  border-color: #1976d2;
}
.border-warning {
  border-color: #fbc02d;
}
.border-danger {
  border-color: #d32f2f;
}

canvas {
  width: 100% !important;
  height: 200px !important;
}
</style>
