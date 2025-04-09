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
            <h5 class="card-title text-muted">
              <!-- 전{{ period === 1 ? '' : ` ${period}개` }}월 대비 -->
              수입 지출 통계
            </h5>

            <!-- 첫 번째 줄: 총 지출, 평균 일 지출, 최다 카테고리 -->
            <div class="row">
              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted"
                  >총 수입
                  <span
                    :class="
                      parseFloat(periodStat.diffIncome.replace('%', '')) > 0
                        ? 'text-success'
                        : 'text-danger'
                    "
                    >{{ periodStat.diffIncome }}</span
                  >
                </small>
                <div class="h5">
                  <AnimatedNumber :value="periodStat.income" />원
                </div>
                <div class="small">
                  {{
                    periodStat.prevIncome === 0
                      ? '이전 데이터 없음'
                      : `지난달 ${periodStat.prevIncome.toLocaleString()}원`
                  }}
                </div>
              </div>
              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted"
                  >총 지출
                  <span
                    :class="
                      parseFloat(periodStat.diffIncome.replace('%', '')) < 0
                        ? 'text-success'
                        : 'text-danger'
                    "
                    >{{ periodStat.diffExpense }}</span
                  >
                </small>
                <div class="h5">
                  <AnimatedNumber :value="periodStat.expense" />원
                </div>
                <div class="small">
                  {{
                    periodStat.prevExpense === 0
                      ? '이전 데이터 없음'
                      : `지난달 ${periodStat.prevExpense.toLocaleString()}원`
                  }}
                </div>
              </div>
              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted">합계</small>
                <div
                  class="h5"
                  :class="
                    periodStat.income - periodStat.expense > 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  <AnimatedNumber
                    :value="periodStat.income - periodStat.expense"
                  />원
                </div>
              </div>
              <div class="col-12 col-md-3">
                <small class="text-muted">최다 지출 카테고리</small>
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
            <span class="score" :class="gradeInfo.color">{{
              gradeInfo.grade
            }}</span>
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
import { renderCategoryChart, renderWeeklyChart } from '@/composables/useChart';
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import axios from 'axios';

const categoryChart = ref(null);
const weeklyChart = ref(null);

const period = ref(1);
const periodStat = reactive({
  expense: 0,
  income: 0,
  topCategory: '데이터 없음',
  prevIncome: 0,
  prevExpense: 0,
  diffExpense: '',
  diffIncome: '',
  category: {},
});

watch(period, () => {
  updatePeriodStats();
});

const state = reactive({ userTransactions: [] });

const userId = localStorage.getItem('userId');
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
  periodStat.expense = stats.expense;
  periodStat.income = stats.income;
  periodStat.topCategory = stats.topCategory;
  periodStat.prevExpense = stats.prevExpense;
  periodStat.prevIncome = stats.prevIncome;
  periodStat.diffIncome = stats.diffIncome;
  periodStat.diffExpense = stats.diffExpense;
  periodStat.category = stats.category;
}

function getFiltered(transactions, type, prevDate, curDate) {
  return transactions.filter((t) => {
    const txDate = new Date(t.date);
    return t.type === type && txDate >= prevDate && txDate <= curDate;
  });
}

function getPeriodStats(period, transactions) {
  const now = new Date();
  const prevDate = new Date();
  const compareDate = new Date();
  prevDate.setMonth(now.getMonth() - period);
  compareDate.setMonth(prevDate.getMonth() - period);

  // 현재 기간
  const curExpenseFilter = getFiltered(transactions, 'expense', prevDate, now);
  const curIncomeFilter = getFiltered(transactions, 'income', prevDate, now);

  // 이전 기간
  const prevExpeseFilter = getFiltered(
    transactions,
    'expense',
    compareDate,
    prevDate
  );

  // 이전 기간
  const prevIncomeFilter = getFiltered(
    transactions,
    'income',
    compareDate,
    prevDate
  );

  //총 수입 계산
  const currentIncome = curIncomeFilter.reduce((sum, t) => sum + t.amount, 0);
  const prevIncome = prevIncomeFilter.reduce((sum, t) => sum + t.amount, 0);

  // 총 지출 계산
  const currentExpense = curExpenseFilter.reduce((sum, t) => sum + t.amount, 0);
  const prevExpense = prevExpeseFilter.reduce((sum, t) => sum + t.amount, 0);

  const diffExpense = getDiffRate(prevExpense, currentExpense);
  const diffIncome = getDiffRate(prevIncome, currentIncome);
  // 최다 지출 카테고리 계산
  const { categoryMap, topCategory } = getTopCategory(curExpenseFilter);

  return {
    expense: currentExpense,
    income: currentIncome,
    topCategory,
    category: categoryMap,
    prevExpense,
    prevIncome,
    diffExpense,
    diffIncome,
  };
}

function getDiffRate(prev, cur) {
  let diffRate;
  if (prev === 0) {
    diffRate = cur === 0 ? 0 : 100;
  } else {
    diffRate = ((cur - prev) / Math.abs(prev)) * 100;
  }
  return (diffRate > 0 ? '+' : '') + diffRate.toFixed(1) + '%';
}
function getTopCategory(curExpenseFilter) {
  let total = 0;
  const categoryMap = {};

  curExpenseFilter.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += t.amount;
    total += t.amount;
  });

  // 가장 높은 비중의 카테고리 계산
  let topCategory = '데이터 없음';
  let max = 0;
  for (const [category, amount] of Object.entries(categoryMap)) {
    if (amount > max) {
      max = amount;
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
  const val = (periodStat.expense / periodStat.income) * 100;
  let grade = '';
  let flag = '';
  let color = '';
  if (val <= 30) {
    grade = 'A';
    flag = '30%';
    color = 'text-success';
  } else if (val <= 50) {
    grade = 'B';
    flag = '50%';
    color = 'text-primary';
  } else if (val <= 80) {
    grade = 'C';
    flag = '80%';
    color = 'text-warning';
  } else {
    grade = 'D';
    flag = '80%';
    color = 'text-danger';
  }
  return {
    grade,
    message:
      grade === 'D'
        ? `수입에서 ${flag}이상 지출했어요!`
        : `수입에서 ${flag}정도 지출했어요!`,
    color,
  };
});

onMounted(async () => {
  await fetchUserTransactions();
  renderCategoryChart(categoryChart.value, periodStat);
  renderWeeklyChart(weeklyChart.value, periodStat);
});

watch(period, async () => {
  await fetchUserTransactions(); // period 변경 시 데이터 재조회
  renderCategoryChart(categoryChart.value, periodStat);
  renderWeeklyChart(weeklyChart.value, periodStat);
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
  margin: auto;
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
  height: 400px !important;
}
</style>
