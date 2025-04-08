<template>
  <div class="container my-5">
    <h5 class="fw-bold mb-2">구독 관리</h5>
    <p class="text-muted">고정 지출 내역을 관리하세요</p>

    <!-- 상단 카드 3개 -->
    <div class="row g-3 mb-4">
      <div class="col-lg-4">
        <FixedExpenseSum :subscriptions="subscriptions" @openAdd="openAdd" />
      </div>
      <div class="col-lg-4">
        <FixedUpcoming :subscriptions="subscriptions" />
      </div>
      <div class="col-lg-4">
        <FixedExpenseQuickAdd/>
      </div>
    </div>

    <!-- 구독 목록 -->
    <FixedExpenseList :subscriptions="subscriptions" />
  </div>
</template>

<script setup>
import FixedExpenseSum from '@/components/fixedExpenses/FixedExpenseSum.vue';
import FixedUpcoming from '@/components/fixedExpenses/FixedUpcoming.vue';
import FixedExpenseList from '@/components/fixedExpenses/FixedExpenseList.vue';
import FixedExpenseQuickAdd from'@/components/fixedExpenses/FixedExpenseQuickAdd.vue';


const subscriptions = [
  { name: 'Netflix', price: 17000, day: 15, boxColor: '#fcecec',dotColor: '#e74c3c' },
  { name: '헬스장', price: 80000, day: 1, boxColor: '#f1f9fa',dotColor: '#52a8c9'},
  { name: '통신비', price: 50000, day: 10, boxColor: '#fff7ec',dotColor: '#f2992e'  },
  { name: '멜론', price: 10900, day: 20, boxColor: '#f1f9f3', dotColor: '#64c364' },
];

const openAdd = () => {
  alert('추가 기능 열기!');
};
</script>
