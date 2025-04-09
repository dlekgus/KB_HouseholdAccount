<template>
  <div class="card shadow-sm p-4 h-85 d-flex flex-column">
    <h6 class="text-muted mb-3">다가오는 결제</h6>
    <div class="scroll-area flex-grow-1">
      <div
        v-for="item in subscriptions"
        :key="item.name"
        class="d-flex justify-content-between mb-2"
      >
        <div class="d-flex align-items-center gap-2">
          <span :style="{ color: item.dotColor, fontSize: '0.7rem' }">●</span>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <small class="text-muted me-2">{{ item.day }}일</small>
          <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
  subscriptions: Array,
});

// 단순 정렬 (예: 오늘 이후 결제만 표시할 수도 있음)
const upcoming = computed(() =>
  [...props.subscriptions].sort((a, b) => a.day - b.day).slice(0, 5)
);
</script>

<style scoped>
.scroll-area {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 6px;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}
.scroll-area::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
.scroll-area::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
