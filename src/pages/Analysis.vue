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
                <div class="h5">2,456,000원</div>
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
                <div class="h5">식비</div>
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
          <div class="circle">
            <span class="score" :class="gradeInfo.color">{{ rate }}%</span>
          </div>
          <div class="mt-2 fw-bold">{{ gradeInfo.grade }}등급</div>
          <div class="text-muted">{{ gradeInfo.message }}</div>
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
import { onMounted, ref, computed } from 'vue';
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
const currentData = ref([]);
const previousData = ref([]);
const changeRate = ref(0);

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

const rate = computed(() => {
  const expense = currentData.value;
  const income = previousData.value;
  return Math.round((expense / (income || 1)) * 100);
});

const gradeInfo = computed(() => {
  const val = rate.value;
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

onMounted(() => {
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
  border: 10px solid #6f42c1;
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
canvas {
  width: 100% !important;
  height: 200px !important;
}
</style>
