<template>
  <div class="container">
    <h5>이번 달 수입/지출</h5>
    <div class="card">
      <p>이번 달 수입: {{ income.toLocaleString() }}원</p>
    </div>
    <div class="card">
      <p>이번 달 지출: {{ expense.toLocaleString() }}원</p>
    </div>
  </div>
</template>

<<<<<<< HEAD
<!-- <script>
import { useUserStore } from '@/stores/userStore';
=======
<script setup>
>>>>>>> main
import { useTransactionStore } from '@/stores/transactionStore';

const transactionStore = useTransactionStore();

<<<<<<< HEAD
onMounted(async () => {
  const userId = userStore.user?.id || localStorage.getItem('userId');
  if (!userId) return;

  await transactionStore.fetchByUser(userId);
});
</script> -->
=======
const income = transactionStore.currentMonthIncome;
const expense = transactionStore.currentMonthExpense;
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
}
.container {
  margin-bottom: 3rem;
}
</style>
>>>>>>> main
