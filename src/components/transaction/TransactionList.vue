<template>
  <div
    class="card border rounded-4 shadow-sm bg-white mt-4 overflow-hidden position-relative"
  >
    <div
      v-if="isLoading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style="background-color: rgba(0, 0, 0, 0.3); z-index: 10"
    >
      <Loading />
    </div>

    <!-- 거래 내역 테이블 -->
    <table
      class="table mb-0 align-middle table-fixed"
      style="table-layout: fixed"
    >
      <thead class="table-light text-secondary small">
        <tr>
          <th class="ps-4 p-3" style="width: 15%">날짜</th>
          <th class="p-3" style="width: 15%">카테고리</th>
          <th class="p-3" style="width: 20%">내용</th>
          <th class="p-3" style="width: 35%">메모</th>
          <th class="text-end pe-4 p-3" style="width: 15%">금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in pagedTransactions" :key="item.id" class="border-top">
          <td class="ps-4 p-3">{{ item.date }}</td>
          <td class="p-3">
            <span class="me-1" :style="{ color: getColor(item.category) }"
              >⬤</span
            >
            {{ item.category }}
          </td>
          <td class="fw-semibold p-3">{{ item.title }}</td>
          <td class="text-secondary small p-3">{{ item.memo }}</td>
          <td
            class="text-end pe-4 fw-semibold p-3"
            :class="
              item.amount > 0
                ? item.type === 'income'
                  ? 'text-primary'
                  : 'text-danger'
                : ''
            "
          >
            {{ item.amount > 0 ? (item.type === "income" ? "+" : "-") : ""
            }}{{ item.amount.toLocaleString() }}원
          </td>
        </tr>
        <tr v-if="pagedTransactions.length === 0">
          <td colspan="5" class="text-center text-muted p-3">
            {{ message || "거래 내역이 없습니다." }}
          </td>
        </tr>
      </tbody>

      <!-- tfoot -->
      <tfoot>
        <tr>
          <td colspan="5" class="px-4 py-2">
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-secondary small">총 {{ totalCount }}건</span>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <button class="page-link" @click="goToPage(1)">«</button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <button class="page-link" @click="prevPage">‹</button>
                  </li>
                  <li class="page-item active">
                    <span class="page-link">{{ currentPage }}</span>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button class="page-link" @click="nextPage">›</button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button class="page-link" @click="goToPage(totalPages)">
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
function getColor(category) {
  const map = {
    식비: "red",
    교통: "blue",
    급여: "green",
    쇼핑: "orange",
    생활: "orange",
    기타: "gray",
  };
  return map[category] || "black";
}
</script>

<script setup>
import { ref, computed, watch } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";
import Loading from "@/components/Loading.vue";

const transactionStore = useTransactionStore();
const { transactions, isLoading, viewDate, viewMode } =
  storeToRefs(transactionStore);

const currentPage = ref(1);
const pageSize = 5;
const message = ref("거래 내역이 없습니다.");

const totalCount = computed(() => transactions.value.length);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return transactions.value.slice(start, start + pageSize);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

watch([viewDate, viewMode], () => {
  currentPage.value = 1;
});
</script>
