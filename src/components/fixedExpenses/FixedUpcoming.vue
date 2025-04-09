<template>
  <div class="card shadow-sm p-4 d-flex flex-column" style="height: 250px;">
    <h6 class="text-muted mb-3">다가오는 결제</h6>
    <div class="scroll-area flex-grow-1">
      <div v-for="item in upcoming" :key="item.name" class="d-flex justify-content-between mb-2">
        <div class="d-flex align-items-center gap-2">
          <span :class="['badge', getBadgeClass(item.day)]">
              {{ getDDay(item.day) }}
            </span>
          <span>{{ item.name }}</span>
        </div>
        <div class="text-end">
          <small class="me-2">
          </small> <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>
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

const getDDayNumber = (dueDay) => {
  const today = new Date().getDate();
  return dueDay >= today ? dueDay - today : 30 - today + dueDay;
};

const getDDay = (dueDay) => {
  const d = getDDayNumber(dueDay);
  return d === 0 ? 'D-DAY' : `D-${d}`;
};

const getBadgeClass = (dueDay) => {
  const d = getDDayNumber(dueDay);
  if (d <= 7) return 'bg-danger text-white';
  if (d <= 15) return 'bg-warning text-dark';
  return 'bg-success text-white';
};

const upcoming = computed(() =>
  [...props.subscriptions]
    .map(item => ({
      ...item,
      dday: getDDayNumber(item.day)
    }))
    .sort((a, b) => a.dday - b.dday)
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

.badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  width: 50px;
}
</style>
