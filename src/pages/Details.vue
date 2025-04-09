<template>
  <div class="container py-4">
    <h2 class="fw-bold fs-4 mb-4">거래내역</h2>
    <p class="font-light">수입/지출 내역을 관리하세요</p>

    <!-- 상단 차트/요약 -->
    <div class="row g-3 align-items-stretch h-auto">
      <div class="col-12 col-lg-8 my-4">
        <TransactionChart />
      </div>
      <div class="col-12 col-lg-4 my-4">
        <TransactionSummary />
      </div>
    </div>

    <!-- 필터 및 날짜 이동 -->
    <div class="d-flex justify-content-between mb-2">
      <div class="btn-group" role="group">
        <button
          class="btn"
          :class="viewMode === '일간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setViewMode('일간')"
        >
          일간
        </button>
        <button
          class="btn"
          :class="viewMode === '주간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setViewMode('주간')"
        >
          주간
        </button>
        <button
          class="btn"
          :class="viewMode === '월간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="setViewMode('월간')"
        >
          월간
        </button>
      </div>
      <div>
        <button class="btn" @click="prevDate">〈</button>
        <span class="mx-2">{{ formattedDateText }}</span>
        <button class="btn" @click="nextDate">〉</button>
      </div>
    </div>

    <!-- 거래 목록 -->
    <TransactionMobileList v-if="isMobile" />
    <TransactionList v-else />

    <!-- 플로팅 추가 버튼 -->
    <button
      class="fab btn btn-primary rounded-circle position-fixed"
      @click="showTransactionModal = true"
    >
      +
    </button>

    <!-- 거래 추가 모달 -->
    <TransactionModal
      v-if="showTransactionModal"
      @close="showTransactionModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
import { useTransactionStore } from "@/stores/transaction";

import TransactionChart from "@/components/transaction/TransactionChart.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TransactionList from "@/components/transaction/TransactionList.vue";
import TransactionModal from "@/components/modal/TransactionModal.vue";
import TransactionMobileList from "@/components/transaction/TransactionMobileList.vue";

const showTransactionModal = ref(false);

const transactionStore = useTransactionStore();
const viewDate = computed(() => transactionStore.viewDate);
const viewMode = computed(() => transactionStore.viewMode);
const { setViewDate, setViewMode } = transactionStore;

const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const formattedDateText = computed(() => {
  const date = dayjs(viewDate.value);

  if (viewMode.value === "일간") {
    return isMobile
      ? date.format("YYYY. M. D.")
      : date.format("YYYY년 M월 D일");
  } else if (viewMode.value === "주간") {
    const start = date.startOf("week");
    const end = date.endOf("week");
    return isMobile
      ? `${start.format("MM. DD.")} ~ ${end.format("MM. DD.")}`
      : `${start.format("M월 D일")} ~ ${end.format("M월 D일")}`;
  } else {
    return isMobile ? date.format("YYYY. MM.") : date.format("YYYY년 M월");
  }
});

const prevDate = () => {
  const date = dayjs(viewDate.value);
  if (viewMode.value === "일간") {
    setViewDate(date.subtract(1, "day"));
  } else if (viewMode.value === "주간") {
    setViewDate(date.subtract(1, "week"));
  } else {
    setViewDate(date.subtract(1, "month"));
  }
};

const nextDate = () => {
  const date = dayjs(viewDate.value);
  if (viewMode.value === "일간") {
    setViewDate(date.add(1, "day"));
  } else if (viewMode.value === "주간") {
    setViewDate(date.add(1, "week"));
  } else {
    setViewDate(date.add(1, "month"));
  }
};
</script>

<style scoped>
.fab {
  bottom: 20px;
  right: 20px;
}
</style>