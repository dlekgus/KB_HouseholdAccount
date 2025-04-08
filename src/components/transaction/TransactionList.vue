<template>
  <div class="card border rounded-4 shadow-sm bg-white mt-4 overflow-hidden">
    <table
      class="table mb-0 align-middle table-fixed"
      style="table-layout: fixed"
    >
      <thead class="table-light text-secondary small">
        <tr>
          <th class="ps-4 p-3" style="width: 15%">날짜</th>
          <th class="p-3" style="width: 120px">카테고리</th>
          <th class="p-3" style="width: 20%">내용</th>
          <th class="p-3" style="width: 35%">메모</th>
          <th class="text-end pe-4 p-3" style="width: 15%">금액</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in transactions"
          :key="index"
          class="border-top"
        >
          <td class="ps-4 p-3">{{ item.date }}</td>
          <td class="p-3">
            <span class="me-1" :style="{ color: item.color }">⬤</span>
            {{ item.category }}
          </td>
          <td class="fw-semibold p-3">{{ item.title }}</td>
          <td class="text-secondary small p-3">{{ item.memo }}</td>
          <td
            class="text-end pe-4 fw-semibold p-3"
            :class="item.amount > 0 ? 'text-primary' : 'text-danger'"
          >
            {{ item.amount > 0 ? "+" : "" }}{{ item.amount.toLocaleString() }}원
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="text-start text-secondary ps-4 py-2 small">
            총 {{ allTransactions.length }}건
          </td>
        </tr>
      </tfoot>
    </table>

    <div
      class="d-flex justify-content-between align-items-center p-3 border-top"
    >
      <div></div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage > 1 && currentPage--">
              «
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="currentPage < totalPages && currentPage++"
            >
              »
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const allTransactions = [
  // 페이지 1
  {
    date: "2024-01-15",
    category: "식비",
    color: "red",
    title: "점심식사",
    memo: "회사 근처 식당",
    amount: -15000,
  },
  {
    date: "2024-01-15",
    category: "급여",
    color: "green",
    title: "1월 급여",
    memo: "월급",
    amount: 3500000,
  },
  {
    date: "2024-01-15",
    category: "교통",
    color: "blue",
    title: "택시비",
    memo: "야근 택시",
    amount: -25000,
  },
  {
    date: "2024-01-14",
    category: "생활/쇼핑",
    color: "orange",
    title: "생활품 구매",
    memo: "샴푸, 치약, 세제 등",
    amount: -89000,
  },
  {
    date: "2024-01-14",
    category: "식비",
    color: "red",
    title: "저녁식사",
    memo: "회식",
    amount: -54000,
  },
  // 페이지 2
  {
    date: "2024-01-13",
    category: "교통",
    color: "blue",
    title: "지하철",
    memo: "퇴근 지하철",
    amount: -1250,
  },
  {
    date: "2024-01-13",
    category: "식비",
    color: "red",
    title: "아침식사",
    memo: "편의점",
    amount: -3200,
  },
  {
    date: "2024-01-13",
    category: "기타",
    color: "gray",
    title: "선물",
    memo: "친구 생일",
    amount: -30000,
  },
  {
    date: "2024-01-12",
    category: "급여",
    color: "green",
    title: "성과급",
    memo: "보너스",
    amount: 500000,
  },
  {
    date: "2024-01-12",
    category: "교통",
    color: "blue",
    title: "버스",
    memo: "출근 버스",
    amount: -1250,
  },
  // 페이지 3
  {
    date: "2024-01-11",
    category: "식비",
    color: "red",
    title: "야식",
    memo: "치킨 배달",
    amount: -18000,
  },
  {
    date: "2024-01-11",
    category: "쇼핑",
    color: "orange",
    title: "온라인 쇼핑",
    memo: "의류 구매",
    amount: -120000,
  },
  {
    date: "2024-01-10",
    category: "생활",
    color: "orange",
    title: "전기요금",
    memo: "한전",
    amount: -67000,
  },
  {
    date: "2024-01-10",
    category: "기타",
    color: "gray",
    title: "기부금",
    memo: "단체 후원",
    amount: -10000,
  },
  {
    date: "2024-01-09",
    category: "식비",
    color: "red",
    title: "간식",
    memo: "카페",
    amount: -7500,
  },
];

const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(allTransactions.length / pageSize));

const transactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return allTransactions.slice(start, start + pageSize);
});
</script>
