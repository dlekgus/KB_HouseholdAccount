// File: pages/Transactions.vue
<template>
  <div class="container py-4">
    <h2 class="fw-bold fs-4 mb-4">거래내역</h2>
    <p class="font-light">수입/지출 내역을 관리하세요</p>

    <div class="row g-3 align-items-stretch h-auto">
      <div class="col-12 col-lg-8 my-4">
        <!-- 수입/지출 비교 차트 -->
        <TransactionChart />
      </div>
      <div class="col-12 col-lg-4 my-4">
        <!-- 수입/지출 요약 -->
        <TransactionSummary />
      </div>
    </div>

    <!-- 필터 및 검색 바 -->
    <div class="d-flex justify-content-between mb-2">
      <div>
        <button
          class="btn m-2"
          :class="viewMode === '일간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="viewMode = '일간'"
        >
          일간
        </button>
        <button
          class="btn m-2"
          :class="viewMode === '주간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="viewMode = '주간'"
        >
          주간
        </button>
        <button
          class="btn m-2"
          :class="viewMode === '월간' ? 'btn-primary' : 'btn-outline-primary'"
          @click="viewMode = '월간'"
        >
          월간
        </button>
      </div>
      <div>
        <button class="btn" @click="prevDate">〈</button>
        <span class="mx-2">{{ formatDate(currentDate) }}</span>
        <button class="btn" @click="nextDate">〉</button>
      </div>
    </div>

    <!-- 거래 목록 테이블 -->
    <TransactionList />

    <!-- 플로팅 액션 버튼 -->
    <button
      class="fab btn btn-primary rounded-circle position-fixed"
      @click="showTransactionModal = true"
    >
      +
      <!-- <font-awesome-icon :icon="['fas', 'circle-plus']" /> -->
    </button>

    <!-- 거래 추가 모달 -->
    <TransactionModal
      v-if="showTransactionModal"
      @close="showTransactionModal = false"
    />
  </div>
</template>

<script setup>
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TransactionChart from "@/components/transaction/TransactionChart.vue";
import TransactionList from "@/components/transaction/TransactionList.vue";
import TransactionModal from "@/components/modal/TransactionModal.vue";

import { ref } from "vue";

const showTransactionModal = ref(false);

const viewMode = ref("일간");
const currentDate = ref(new Date());

// 날짜 표시 포맷 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (viewMode.value === "일간") {
    return `${year}년 ${month}월 ${day}일`;
  } else if (viewMode.value === "주간") {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // 일요일
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 토요일

    return `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 ~ ${
      weekEnd.getMonth() + 1
    }월 ${weekEnd.getDate()}일`;
  } else {
    return `${year}년 ${month}월`;
  }
};

// 날짜 이동
const prevDate = () => {
  const date = new Date(currentDate.value);
  if (viewMode.value === "일간") {
    date.setDate(date.getDate() - 1);
  } else if (viewMode.value === "주간") {
    date.setDate(date.getDate() - 7);
  } else {
    date.setMonth(date.getMonth() - 1);
  }
  currentDate.value = date;
};

const nextDate = () => {
  const date = new Date(currentDate.value);
  if (viewMode.value === "일간") {
    date.setDate(date.getDate() + 1);
  } else if (viewMode.value === "주간") {
    date.setDate(date.getDate() + 7);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  currentDate.value = date;
};
</script>

<style scoped>
/* 플로팅 버튼 */
.fab {
  bottom: 80px;
  right: 20px;
}
</style>
