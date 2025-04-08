
<script setup>
import FixedSummary from '@/components/fixedExpenses/FixedSummary.vue';
import FixedQuickAdd from '@/components/fixedExpenses/FixedQuickAdd.vue';
import FixedExpenseList from '@/components/fixedExpenses/FixedExpenseList.vue';

const userId = 1;
const subscriptions = [
  { id: 1, userId: 1, name: "Netflix", price: 17000, dueDate: 15, category: "구독" },
  { id: 2, userId: 1, name: "헬스장", price: 80000, dueDate: 1, category: "고정지출" },
  { id: 3, userId: 1, name: "통신비", price: 50000, dueDate: 10, category: "고정지출" },
  { id: 4, userId: 1, name: "멜론", price: 10900, dueDate: 20, category: "구독" }
];
</script>

<template>
  <div class="container">
    <h2 class="page-title">고정관리</h2>
    <p class="subtitle">월 고정 지출 내역을 관리하세요</p>

    <FixedSummary :subscriptions="subscriptions" :userId="userId" />
    <FixedQuickAdd />
    <FixedExpenseList :subscriptions="subscriptions" :userId="userId" />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: sans-serif;
}
.page-title {
  font-size: 1.8rem;
  font-weight: bold;
}
.subtitle {
  color: #666;
  margin-bottom: 1rem;
}
</style>
