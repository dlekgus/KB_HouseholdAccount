<template>
  <div class="container">
    <h5>이번 달 수입/지출</h5>
    <div class="card">
      <div class="content">
        <h6 class="type">수입</h6>
        <p class="amount">{{ income.toLocaleString() }}원</p>
      </div>
      <div class="icon" style="background-color: #eff6ff">
        <i class="fa-solid fa-arrow-up" style="color: #4754ff"></i>
      </div>
    </div>
    <div class="card">
      <div class="content">
        <h6 class="type">지출</h6>
        <p class="amount">{{ expense.toLocaleString() }}원</p>
      </div>
      <div class="icon" style="background-color: #fef2f2">
        <i class="fa-solid fa-arrow-down" style="color: #fb5b5b"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import { watch, ref, transformVNodeArgs } from 'vue';

const transactionStore = useTransactionStore();
const income = ref(0);
const expense = ref(0);

watch(
  () => transactionStore.transactions,
  (newVal) => {
    if (!newVal.length) return; // 아직 안 불러왔거나 데이터 없음

    income.value = transactionStore.currentMonthIncome;
    expense.value = transactionStore.currentMonthExpense;
  },
  {
    immediate: true, // mounted 직후 1회 실행
    deep: false, // shallow 비교면 충분 (배열 참조만 바뀌면 감지됨)
  }
);
</script>

<style scoped>
.summary-box {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
}
.income {
  color: red;
}
.expense {
  color: blue;
}
.card {
  margin: 1rem;
  padding: 1rem;
  justify-content: center;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  border: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.container {
  margin-bottom: 3rem;
}
.type {
  color: gray;
  padding-bottom: 0;
}
.amount {
  font-weight: bolder;
}
.icon {
  /* height: 100%; */
  width: 70px;
  border-radius: 10px;
  align-content: center;
  text-align: center;
}
</style>
>>>>>>> main
