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
              전{{ period === 1 ? '' : ` ${period}개` }}월 대비
            </h5>

            <!-- 첫 번째 줄: 총 지출, 평균 일 지출, 최다 카테고리 -->
            <div class="row">
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">총 수입</small>
                <div class="h5 text-success">
                  <AnimatedNumber :value="periodStat.income" />원
                </div>
              </div>
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">총 지출</small>
                <div class="h5">
                  <AnimatedNumber :value="periodStat.total" />원
                </div>
                <div class="small" :class="changeRateClass">
                  {{
                    formattedChangeRate === '0.0%'
                      ? '이전 데이터 없음'
                      : formattedChangeRate
                  }}
                </div>
              </div>
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">합계</small>
                <div
                  class="h5"
                  :class="{
                    'text-danger': netDiff < 0,
                    'text-success': netDiff >= 0,
                  }"
                >
                  <AnimatedNumber :value="Math.abs(netDiff)" />원
                  <span class="small">
                    {{ netDiff < 0 ? '지출 초과' : '수입 초과' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 두 번째 줄: 수입, 수입 - 지출 합계 -->
            <div class="row">
              <div class="col-12 col-md-4 mb-3">
                <small class="text-muted">평균 일 지출</small>
                <div class="h5">
                  <AnimatedNumber :value="periodStat.dailyAvg" />원
                </div>
                <div class="small" :class="chagedailyRateClass">
                  {{
                    formattedDailyRate === '0.0%'
                      ? '이전 데이터 없음'
                      : formattedDailyRate
                  }}
                </div>
              </div>
              <div class="col-12 col-md-4">
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
  dailyAvg: 0,
  topCategory: '데이터 없음',
  changeRate: 0,
  dailyAvgChangeRate: 0,
  category: {},
});

watch(period, () => {
  updatePeriodStats();
});

const state = reactive({ userTransactions: [] });

const userId = 10;
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

  // 총 지출 계산
  const currentTotal = curExpenseFilter.reduce((sum, t) => sum + t.amount, 0);
  const prevTotal = prevExpeseFilter.reduce((sum, t) => sum + t.amount, 0);

  // 일 평균 계산
  const dailyAvg = getAvg(prevDate, now, currentTotal);
  const prevDailyAvg = getAvg(compareDate, prevDate, prevTotal);

  // 증감율 계산
  const totalChangeRate = getChangeRage(prevTotal, currentTotal);
  const dailyAvgChangeRate = getChangeRage(prevDailyAvg, dailyAvg);

  // 최다 지출 카테고리 계산
  const { categoryMap, topCategory } = getTopCategory(curExpenseFilter);

  return {
    total: currentTotal,
    dailyAvg,
    topCategory,
    changeRate: totalChangeRate,
    dailyAvgChangeRate,
    category: categoryMap,
  };
}

// 일 평균 값 구하기
function getAvg(prevDate, now, total) {
  const diffDays = Math.max(
    1,
    Math.floor((now - prevDate) / (1000 * 60 * 60 * 24))
  );
  return Math.round(total / diffDays);
}

function getChangeRage(prevTotal, curTotal) {
  if (prevTotal === 0) {
    return 0;
  }
  return ((curTotal - prevTotal) / (prevTotal || 1)) * 100;
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
  const val = periodStat.changeRate;
  if (val <= 0)
    return { grade: 'A', message: '절약 잘했어요!', color: 'text-success' };
  if (val <= 25)
    return { grade: 'B', message: '양호한 소비입니다.', color: 'text-primary' };
  if (val <= 50)
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
  height: 400px !important;
}
</style>
