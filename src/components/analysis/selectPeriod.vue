<template>
  <div class="container py-4">
    <!-- 기간 선택 -->
    <div class="mb-4 d-flex flex-wrap gap-2">
      <button
        v-for="m in [1, 3, 6, 12]"
        :key="m"
        class="btn"
        :class="period === m ? 'btn-primary' : 'btn-secondary'"
        @click="selectPeriod(m)"
      >
        {{ m }}개월
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAnalysisStore } from '@/stores/analysisStore';
import { computed } from 'vue';
const store = useAnalysisStore();
const { selectPeriod } = store;
const period = computed(() => store.period);
</script>

<style scoped>
.btn-secondary {
  --bs-btn-bg: #a5abaf;
  --bs-btn-border-color: #a5abaf;
}
</style>
