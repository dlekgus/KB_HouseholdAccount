<template>
  <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
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
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  expense: Number,
  income: Number,
});

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
  const val = (props.expense / props.income) * 100;
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
</style>
