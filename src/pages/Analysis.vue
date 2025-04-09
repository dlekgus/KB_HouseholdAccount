<template>
  <div class="container py-4">
    <!-- 기간 선택 -->
    <div class="mb-4 d-flex flex-wrap gap-2">
      <button
        v-for="m in [1, 3, 6, 12]"
        :key="m"
        class="btn"
        :class="store.period === m ? 'btn-primary' : 'btn-secondary'"
        @click="store.selectPeriod(m)"
      >
        {{ m }}개월
      </button>
    </div>

    <!-- 요약 및 점수 -->
    <div class="row g-4">
      <!-- 수입 지출 카드 -->
      <div class="col-12 col-md-8">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-muted">수입 지출 통계</h5>

            <!-- 총 수입, 지출 등 -->
            <div class="row">
              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted">
                  총 수입
                  <span
                    :class="
                      parseFloat(store.periodStat.diffIncome.replace('%', '')) >
                      0
                        ? 'text-success'
                        : 'text-danger'
                    "
                  >
                    {{ store.periodStat.diffIncome }}
                  </span>
                </small>
                <div class="h5">
                  <AnimatedNumber :value="store.periodStat.income" />원
                </div>
                <div class="small">
                  {{
                    store.periodStat.prevIncome === 0
                      ? '지난 데이터 없음'
                      : `지난 수입 ${store.periodStat.prevIncome.toLocaleString()}원`
                  }}
                </div>
              </div>

              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted">
                  총 지출
                  <span
                    :class="
                      parseFloat(
                        store.periodStat.diffExpense.replace('%', '')
                      ) < 0
                        ? 'text-success'
                        : 'text-danger'
                    "
                  >
                    {{ store.periodStat.diffExpense }}
                  </span>
                </small>
                <div class="h5">
                  <AnimatedNumber :value="store.periodStat.expense" />원
                </div>
                <div class="small">
                  {{
                    store.periodStat.prevExpense === 0
                      ? '지난 데이터 없음'
                      : `지난 지출 ${store.periodStat.prevExpense.toLocaleString()}원`
                  }}
                </div>
              </div>

              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted">합계</small>
                <div
                  class="h5"
                  :class="
                    store.periodStat.income - store.periodStat.expense > 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  <AnimatedNumber
                    :value="store.periodStat.income - store.periodStat.expense"
                  />원
                </div>
              </div>

              <div class="col-12 col-md-3">
                <small class="text-muted">최다 지출 카테고리</small>
                <div class="h5">
                  {{ store.periodStat.topCategory || '' }}
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
            <span class="score" :class="gradeInfo.color">
              {{ gradeInfo.grade }}
            </span>
          </div>
          <div class="mt-2" :class="gradeInfo.color">
            <div class="fw-bold">{{ gradeInfo.grade }} 등급</div>
            <div class="text-muted">{{ gradeInfo.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 차트 -->
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
import { ref, computed, onMounted, watch } from 'vue';
import { useAnalysisStore } from '@/stores/analysisStore';
import { renderCategoryChart, renderWeeklyChart } from '@/composables/useChart';
import AnimatedNumber from '@/components/AnimatedNumber.vue';

const categoryChart = ref(null);
const weeklyChart = ref(null);

// ✅ Pinia 스토어 가져오기
const store = useAnalysisStore();
const {
  period,
  periodStat,
  fetchUserTransactions,
  selectPeriod,
  updatePeriodStats,
} = store;

const borderColor = computed(() => {
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
  let grade = '',
    flag = '',
    color = '';
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
        ? `수입의 ${flag}이상 지출했어요!`
        : `수입의 ${flag}정도 지출했어요!`,
    color,
  };
});

onMounted(async () => {
  await store.fetchUserTransactions();
  renderCategoryChart(categoryChart.value, store.periodStat);
  renderWeeklyChart(
    weeklyChart.value,
    store.periodStat.income,
    store.periodStat.expense
  );
});
watch(
  () => [store.period], // 바라볼 값들
  () => {
    console.log('call!');
    if (categoryChart.value) {
      renderCategoryChart(categoryChart.value, store.periodStat);
    }
    if (weeklyChart.value) {
      renderWeeklyChart(
        weeklyChart.value,
        store.periodStat.income,
        store.periodStat.expense
      );
    }
  }
);
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
.btn-secondary {
  --bs-btn-bg: #a5abaf;
  --bs-btn-border-color: #a5abaf;
}
canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>
