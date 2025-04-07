<!-- 소비 캘린더 -->
<!-- 이번달 수입/지출 -->
<!-- 최근 거래 -->

<script setup>
import { ref } from 'vue';
import TransactionModal from '@/components/modal/TransactionModal.vue';

const showTransactionModal = ref(false);
import Calendar from '@/components/Calendar.vue';
import HomeLayout from '@/components/layouts/HomeLayout.vue';
import RecentHistory from '@/components/RecentHistory.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div>
    <HomeLayout>
      <template v-slot:calendar>
        <Calendar />
      </template>

      <template v-slot:history>
        <RecentHistory></RecentHistory>
      </template>

      <template v-slot:footer>
        <Footer />
      </template>

      <template v-slot:fab>
        <button class="btn btn-outline" @click="showTransactionModal = true">
          +
          <!-- <font-awesome-icon :icon="['fas', 'circle-plus']" /> -->
        </button>
        <TransactionModal
          v-if="showTransactionModal"
          @close="showTransactionModal = false"
        ></TransactionModal>
      </template>
    </HomeLayout>
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
