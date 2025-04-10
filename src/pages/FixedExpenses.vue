<template>
  <div class="container my-5">
    <h5 class="fw-bold mb-2">구독 관리</h5>
    <p class="text-muted">고정 지출 내역을 관리하세요</p>

    <!-- ✅ 좌우 2단 분할 -->
    <div class="row">
      <!-- 왼쪽: 총합 + 다가오는 결제 -->
      <div class="col-lg-5 d-flex flex-column gap-3" style="margin-bottom: 20px;">
        <FixedExpenseSum :subscriptions="subscriptions" />
        <FixedUpcoming :subscriptions="subscriptions" />
      </div>

      <!-- 오른쪽: 구독 목록 -->
      <div class="col-lg-7">
        <FixedExpenseList :subscriptions="subscriptions" />
      </div>
    </div>

    <!-- ✅ 플로팅 버튼 -->
    <FixedExpenseQuickAdd />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useFixedExpenseStore } from '@/stores/FixedExpenseStore.js';

import FixedExpenseSum from '@/components/fixedExpenses/FixedExpenseSum.vue';
import FixedUpcoming from '@/components/fixedExpenses/FixedUpcoming.vue';
import FixedExpenseList from '@/components/fixedExpenses/FixedExpenseList.vue';
import FixedExpenseQuickAdd from '@/components/fixedExpenses/FixedExpenseQuickAdd.vue';

const store = useFixedExpenseStore();

// 페이지 진입 시 데이터 가져오기
onMounted(() => {
  store.fetchExpenses(); // userId가 있다면 store에서 반영
});

// 색상 랜덤 적용된 subscription 반환
const subscriptions = computed(() =>
  Array.isArray(store.fixedExpenses)
    ? store.fixedExpenses.map((item) => {
        const randomColor =
          store.colorPairs[Math.floor(Math.random() * store.colorPairs.length)];
        return {
          ...item,
          day: item.dueDate,
          ...randomColor,
        };
      })
    : []
);
</script>
