<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

import Calendar from '@/components/Calendar.vue';
import HomeLayout from '@/components/layouts/HomeLayout.vue';
import RecentHistory from '@/components/RecentHistory.vue';
import ThisMonthHistory from '@/components/ThisMonthHistory.vue';
import Footer from '@/components/Footer.vue';
import TransactionModal from '@/components/modal/TransactionModal.vue';
import TransactionDetailModal from '@/components/modal/TransactionDetailModal.vue'; // ✅ 모달 컴포넌트

// ✅ 상태
const showModal = ref(false);
const showDetailModal = ref(false);
const selectedDate = ref('');

const transactionStore = useTransactionStore();

const transactionsByDate = computed(() => {
  const result = {};
  for (const tx of transactionStore.transactions) {
    if (!result[tx.date]) result[tx.date] = [];
    result[tx.date].push(tx);
  }
  return result;
});

// ✅ 날짜 클릭 핸들러
const handleDayClick = (dateStr) => {
  console.log('📅 클릭된 날짜:', dateStr); // 확인용 로그
  selectedDate.value = dateStr;
  showDetailModal.value = true;
};
</script>

<template>
  <div>
    <HomeLayout>
      <template v-slot:calendar>
        <Calendar @day-click="handleDayClick" />
      </template>

      <template v-slot:recent-history>
        <RecentHistory></RecentHistory>
      </template>

      <template v-slot:this-month-history>
        <ThisMonthHistory></ThisMonthHistory>
      </template>

      <template v-slot:footer>
        <Footer />
      </template>

      <template v-slot:fab>
        <button class="btn btn-outline" @click="showModal = true">+</button>
        <TransactionModal
          v-if="showModal"
          @close="showModal = false"
        ></TransactionModal>
      </template>
    </HomeLayout>

    <TransactionDetailModal
      v-if="showDetailModal"
      :date="selectedDate"
      :transactions="transactionsByDate[selectedDate] || []"
      @close="showDetailModal = false"
    />
  </div>
</template>

<style scoped>
button {
  background-color: #4318d1;
  color: white;
  font-weight: bolder;
  font-size: large;
}
</style>
