<template>
  <div class="container">
    <div class="title">
      <h5>최근 거래</h5>
      <router-link class="btn" to="/details">전체보기</router-link>
    </div>

    <div v-for="tx in recentHistory" :key="tx.id" class="card">
      <span>{{ tx.date }}</span>
      <strong :style="{ color: tx.type === 'income' ? 'red' : 'blue' }"
        >{{ tx.type === 'income' ? '+' : '-' }}
        {{ tx.amount.toLocaleString() }}원</strong
      >
      <div>{{ tx.category }}</div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { useTransactionStore } from '@/stores/transactionStore';
import { computed } from 'vue';
import { onMounted } from 'vue';

const transactionStore = useTransactionStore();
onMounted(async () => {
  const userId = localStorage.getItem('userId'); // 또는 userStore.user?.id
  if (userId) {
    await transactionStore.fetchByUser(userId);
    console.log('✅ 거래내역 로드 완료', userId);
  }
});
const recentHistory = computed(() => transactionStore.recentTransactions);
</script>

<style scoped>
.btn {
  color: blue;
}
.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
