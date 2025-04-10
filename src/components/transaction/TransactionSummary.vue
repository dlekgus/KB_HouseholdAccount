<template>
  <div class="card border p-4 rounded-4 shadow-sm bg-white d-flex h-100">
    <h6 class="fw-semibold mb-4">
      {{
        viewMode === "일간"
          ? "오늘 요약"
          : viewMode === "주간"
          ? "이번 주 요약"
          : "이번 달 요약"
      }}
    </h6>

    <div
      class="bg-light rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
    >
      <span v-if="!isLoading" class="text-secondary">수입</span>
      <span v-else class="placeholder col-3">&nbsp;</span>
      <span v-if="!isLoading" class="fw-bold text-primary"
        >+{{ income.toLocaleString() }}원</span
      >
      <span v-else class="placeholder col-2">&nbsp;</span>
    </div>

    <div
      class="bg-light rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
    >
      <span v-if="!isLoading" class="text-secondary">지출</span>
      <span v-else class="placeholder col-3">&nbsp;</span>

      <span v-if="!isLoading" class="fw-bold text-danger"
        >-{{ expense.toLocaleString() }}원</span
      >
      <span v-else class="placeholder col-5">&nbsp;</span>
    </div>

    <div
      class="bg-light rounded-3 p-3 d-flex justify-content-between align-items-center"
    >
      <span v-if="!isLoading" class="text-secondary">합계</span>
      <span v-else class="placeholder col-3">&nbsp;</span>
      <span v-if="!isLoading" class="fw-bold text-dark"
        >{{ (income - expense).toLocaleString() }}원</span
      >
      <span v-else class="placeholder col-4">&nbsp;</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const transactionStore = useTransactionStore();
const { transactions, viewDate, viewMode, isLoading } =
  storeToRefs(transactionStore);

const getRange = () => {
  const base = viewDate.value;
  let start, end;

  if (viewMode.value === "일간") {
    start = base.startOf("day");
    end = base.endOf("day");
  } else if (viewMode.value === "주간") {
    start = base.startOf("week");
    end = base.endOf("week");
  } else {
    start = base.startOf("month");
    end = base.endOf("month");
  }

  return { start, end };
};

const filtered = computed(() => {
  const { start, end } = getRange();
  return transactions.value.filter((tx) => {
    const d = dayjs(tx.date);
    return d.isSameOrAfter(start) && d.isSameOrBefore(end);
  });
});

const income = computed(() =>
  filtered.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
);

const expense = computed(() =>
  filtered.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
);
</script>

<style scoped>
.placeholder {
  background-color: #e9ebee;
  border-radius: 0.25rem;
  animation: pulse 1.5s infinite ease-in-out;
}
</style>
