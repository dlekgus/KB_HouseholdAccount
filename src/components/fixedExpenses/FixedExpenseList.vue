<template>
  <div class="card shadow-sm p-4">
    <h6 class="text-muted mb-3">구독 목록</h6>
    <div v-for="s in subscriptions" :key="s.name"
      class="d-flex justify-content-between align-items-center py-3 border-bottom">
      <div class="d-flex align-items-center gap-3">

        <div :style="getBoxStyle(s.boxColor)" class="rounded-4 d-flex align-items-center justify-content-center me-3"
          style="width: 40px; height: 40px;">
          <span :style="getDotStyle(s.dotColor)" class="rounded-circle"></span>
        </div>
        <div>
          <div class="fw-semibold">{{ s.name }}</div>
          <div class="text-muted small">매월 {{ s.day }}일</div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="fw-bold">{{ s.price.toLocaleString() }}원</span>
        <i class="bi bi-three-dots-vertical"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subscriptions: {
    type: Array,
    required: true,
  },
});

// 각 박스 배경 스타일 계산
function getBoxStyle(color) {
  return {
    backgroundColor: color || '#fcecec',
  };
}

// 동그라미 색상 스타일 계산
function getDotStyle(color) {
  return {
    width: '10px',
    height: '10px',
    backgroundColor: color || '#e74c3c',
  };
}
</script>
