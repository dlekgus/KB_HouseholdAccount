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
                <div class="h5">
                  {{
                    !periodStat.dailyAvg
                      ? 0
                      : periodStat.dailyAvg.toLocaleString()
                  }}원
                </div>
                <div class="small" :class="chagedailyRateClass">
                  {{ formattedDailyRate }}
                </div>
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

let categoryChartInstance = null;
let weeklyChartInstance = null;
// ✅ 상태 변수
const period = ref(1);
const periodStat = reactive({
  expense: 0,
  income: 0,
  dailyAvg: 0,
  topCategory: '',
  changeRate: 0,
  dailyAvgChangeRate: 0,
  category: {},
});

watch(period, () => {
  updatePeriodStats();
});
const currentData = ref([]);
const previousData = ref([]);

const state = reactive({ userTransactions: [] });

const userId = 2;
const BASE_URI = '/api/transactions';
// fetch users all data from db
const fetchUserTransactions = async () => {
  try {
    const response = await axios.get(BASE_URI + `?userId=${userId}`);
    if (response.status === 200) {
      state.userTransactions = response.data;
      updatePeriodStats();
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
  periodStat.dailyAvg = stats.dailyAvg;
  periodStat.topCategory = stats.topCategory;
  periodStat.changeRate = stats.changeRate;
  periodStat.dailyAvgChangeRate = stats.dailyAvgChangeRate;
  periodStat.category = stats.category;
}

function getPeriodStats(period, transactions) {
  const now = new Date();
  const prevDate = new Date();
  const compareDate = new Date();
  prevDate.setMonth(now.getMonth() - period);
  compareDate.setMonth(prevDate.getMonth() - period);

  // 현재 기간
  const currentFiltered = transactions.filter((t) => {
    const txDate = new Date(t.date);
    return t.type === 'expense' && txDate >= prevDate && txDate <= now;
  });

  // 이전 기간
  const prevFiltered = transactions.filter((t) => {
    const txDate = new Date(t.date);
    return t.type === 'expense' && txDate >= compareDate && txDate < prevDate;
  });

  // 총합 계산
  const currentTotal = currentFiltered.reduce((sum, t) => sum + t.amount, 0);
  const prevTotal = prevFiltered.reduce((sum, t) => sum + t.amount, 0);

  // 현재 일평균
  const currDiffDays = Math.max(
    1,
    Math.floor((now - prevDate) / (1000 * 60 * 60 * 24))
  );
  const dailyAvg = Math.round(currentTotal / currDiffDays);

  // 이전 일평균
  const prevDiffDays = Math.max(
    1,
    Math.floor((prevDate - compareDate) / (1000 * 60 * 60 * 24))
  );
  const prevDailyAvg = Math.round(prevTotal / prevDiffDays);

  const { categoryMap, topCategory } = getTopCategory(currentFiltered);
  // 증가율 계산
  const totalChangeRate = ((currentTotal - prevTotal) / (prevTotal || 1)) * 100;
  const dailyAvgChangeRate =
    ((dailyAvg - prevDailyAvg) / (prevDailyAvg || 1)) * 100;

  return {
    total: currentTotal,
    dailyAvg,
    topCategory,
    changeRate: totalChangeRate,
    dailyAvgChangeRate,
    category: categoryMap,
  };
}

function getTopCategory(currentFiltered) {
  let total = 0;
  const categoryMap = {};

  currentFiltered.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += t.amount;
    total += t.amount;
  });

  // 퍼센트로 변환
  Object.keys(categoryMap).forEach((category) => {
    const percentage = (categoryMap[category] / total) * 100;
    categoryMap[category] = Number(percentage.toFixed(2)); // 소수점 2자리
  });

  // 가장 높은 비중의 카테고리 계산
  let topCategory = '';
  let max = 0;
  for (const [category, percent] of Object.entries(categoryMap)) {
    if (percent > max) {
      max = percent;
      topCategory = category;
    }
  }

  return { categoryMap, topCategory };
}
// 기간 선택 함수
function selectPeriod(months) {
  period.value = months;
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
  const val = periodStat.total;
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

function formatRate(rate) {
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
}

function rateClass(rate) {
  if (rate > 0) return 'text-danger';
  if (rate < 0) return 'text-success';
  return 'text-muted';
}
const formattedChangeRate = computed(() => formatRate(periodStat.changeRate));
const formattedDailyRate = computed(() =>
  formatRate(periodStat.dailyAvgChangeRate)
);

const changeRateClass = computed(() => rateClass(periodStat.changeRate));
const chagedailyRateClass = computed(() =>
  rateClass(periodStat.dailyAvgChangeRate)
);

const rate = computed(() => {
  const expense = currentData.value[0];
  const income = previousData.value[0];
  return Math.round((expense / (income || 1)) * 100);
});

const renderCategoryChart = () => {
  if (categoryChartInstance) categoryChartInstance.destroy(); // 이전 차트 제거

  const labels = Object.keys(periodStat.category);
  const data = Object.values(periodStat.category);
  const isEmpty = labels.length === 0 || data.reduce((a, b) => a + b, 0) === 0;
  const backgroundColors = generateColors(labels.length);
  categoryChartInstance = new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: isEmpty ? ['데이터 없음'] : labels,
      datasets: [
        {
          data: isEmpty ? [1] : data,
          backgroundColor: isEmpty
            ? ['#d3d3d3'] // 회색
            : backgroundColors, // 동적으로 색상 생성 함수
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
    },
  });
};

const renderWeeklyChart = () => {
  if (weeklyChartInstance) weeklyChartInstance.destroy();

  weeklyChartInstance = new Chart(weeklyChart.value, {
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
          grid: { display: false },
        },
        y: {
          grid: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(async () => {
  await fetchUserTransactions();
  renderCategoryChart();
  renderWeeklyChart();
});

watch(period, async () => {
  await fetchUserTransactions(); // period 변경 시 데이터 재조회
  renderCategoryChart();
  renderWeeklyChart();
});

const generateColors = (count) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#28a745',
    '#0d6efd',
    '#ffc107',
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
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
