<template>
  <div class="container">
    <h3>이번 달 수입/지출</h3>
    <div class="card">수입</div>
  </div>
</template>
<!-- 
<script>
import { useUserStore } from '@/stores/userStore';
import { useTransactionStore } from '@/stores/transactionStore';

const userStore = useUserStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  const userId = userStore.user?.id || localStorage.getItem('userId');
  if (!userId) return;

  await transactionStore.fetchByUser(userId);
});
</script> -->
