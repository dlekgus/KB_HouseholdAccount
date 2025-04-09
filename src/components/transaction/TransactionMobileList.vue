<template>
  <div>
    <div class="card border shadow-sm rounded-4 p-3 bg-white">
      <div
        v-if="Object.keys(groupedByDate).length === 0"
        class="text-center text-secondary py-5"
      >
        거래 내역이 없습니다.
      </div>

      <div v-for="(items, date) in groupedByDate" :key="date" class="mb-4">
        <div class="fw-bold text-secondary small mb-2">
          {{ formatDate(date) }}
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="d-flex mb-3 align-items-center"
        >
          <div class="me-3" :style="{ fontSize: '1.8rem' }">
            <div
              class="category-circle rounded-circle bg-light d-flex justify-content-center align-items-center text-secondary font-weight-bold align-self-center"
            >
              {{ item.category }}
            </div>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold">{{ item.title }}</div>
            <div class="text-muted small">{{ item.memo }}</div>
          </div>
          <div
            class="fw-semibold"
            :class="item.amount > 0 ? 'text-primary' : 'text-danger'"
          >
            {{ item.amount > 0 ? "+" : "" }}{{ item.amount.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const groupedByDate = computed(() => {
  const grouped = {};
  transactions.value.forEach((tx) => {
    const date = tx.date;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(tx);
  });
  return grouped;
});

const formatDate = (dateStr) => {
  const date = dayjs(dateStr);
  return `${date.format("M월 D일")} ${
    ["일", "월", "화", "수", "목", "금", "토"][date.day()]
  }요일`;
};
</script>

<style scoped>
.category-circle {
  width: 36px;
  height: 36px;
  font-size: 0.6rem;
}
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}
</style>
