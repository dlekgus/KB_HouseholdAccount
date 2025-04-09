<template>
  <div class="card shadow-sm p-4 h-85">
    <div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="text-muted">이번 달 총 구독료</h6>
        <i class="bi bi-bag-check fs-4 text-success"></i>
      </div>
      <h2 class="fw-bold"><AnimatedNumber :value="storeTotalAmount" /> 원</h2>
    </div>
  </div>
</template>

<script setup>
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import { useFixedExpenseStore } from '@/store/FixedExpenseStore.js';

import { computed } from 'vue';

const store = useFixedExpenseStore();
const storeTotalAmount = computed(() => store.totalAmount);
</script>
