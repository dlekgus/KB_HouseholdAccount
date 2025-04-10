<template>
  <div class="card border rounded-4 shadow-sm bg-white mt-4 position-relative">
    <div
      v-if="isLoading"
      class="position-absolute rounded-4 top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style="background-color: rgba(0, 0, 0, 0.3); z-index: 10"
    >
      <Loading />
    </div>

    <!-- 필터 영역 -->
    <div
      class="d-flex flex-wrap justify-content-between gap-2 p-3 border-bottom"
    >
      <div>
        <select v-model="selectedCategory" class="form-select form-select-sm">
          <option value="">전체 카테고리</option>
          <option v-for="(cat, idx) in categoryOptions" :key="idx" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
      <div class="flex-grow-1 mx-2">
        <input
          type="text"
          v-model="searchKeyword"
          class="form-control form-control-sm"
          placeholder="검색어를 입력해주세요"
        />
      </div>
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
          <th class="p-3" style="width: 25%">메모</th>
          <th class="text-end pe-4 p-3" style="width: 20%">금액</th>
          <th class="p-3" style="width: 5%"></th>
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
          <td class="text-end pe-4 fw-semibold p-3">
            <span
              :class="
                item.amount > 0
                  ? item.type === 'income'
                    ? 'text-primary'
                    : 'text-danger'
                  : ''
              "
            >
              {{ item.amount > 0 ? (item.type === "income" ? "+" : "-") : "" }}
              {{ item.amount.toLocaleString() }}원
            </span>
          </td>
          <td>
            <div class="transaction-dropdown position-relative z-index-1">
              <button
                class="btn btn-sm border-0 bg-transparent"
                @click.stop="toggleDropdown(item.id)"
              >
                ⋮
              </button>

              <ul
                v-if="openDropdownId === item.id"
                class="dropdown-menu show position-absolute end-0 mt-1"
                style="display: block"
              >
                <li>
                  <button class="dropdown-item" @click="onEdit(item)">
                    수정
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item text-danger"
                    @click="onDelete(item)"
                  >
                    삭제
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
        <tr v-if="pagedTransactions.length === 0">
          <td colspan="6" class="text-center text-muted p-3">
            {{ message || "거래 내역이 없습니다." }}
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="6" class="px-4 py-2">
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

    <!-- 거래 수정 모달 -->
    <TransactionModal
      v-if="isModalOpen"
      :transaction="selectedTransaction"
      @close="isModalOpen = false"
      @updated="fetchTransactions"
    />
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";
import Loading from "@/components/Loading.vue";
import TransactionModal from "@/components/modal/TransactionModal.vue";

const transactionStore = useTransactionStore();
const { transactions, isLoading, viewDate, viewMode } =
  storeToRefs(transactionStore);

const currentPage = ref(1);
const pageSize = 5;
const message = ref("거래 내역이 없습니다.");
const openDropdownId = ref(null);

const selectedTransaction = ref(null);
const isModalOpen = ref(false);

// 카테고리 필터 및 검색어
const selectedCategory = ref("");
const searchKeyword = ref("");
const categoryOptions = [
  "식비",
  "교통비",
  "주거비",
  "문화생활",
  "의료비",
  "기타",
];

// 필터된 거래
const filteredTransactions = computed(() => {
  return transactions.value.filter((item) => {
    const matchesCategory = selectedCategory.value
      ? item.category === selectedCategory.value
      : true;
    console.log(item);

    const matchesKeyword = searchKeyword.value
      ? item.title.includes(searchKeyword.value) ||
        item.memo.includes(searchKeyword.value)
      : true;
    return matchesCategory && matchesKeyword;
  });
});

const totalCount = computed(() => filteredTransactions.value.length);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTransactions.value.slice(start, start + pageSize);
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

const handleClickOutside = (e) => {
  if (!e.target.closest(".transaction-dropdown")) {
    openDropdownId.value = null;
  }
};

const toggleDropdown = (id) => {
  openDropdownId.value = openDropdownId.value === id ? null : id;
};

const onEdit = (item) => {
  selectedTransaction.value = { ...item };
  isModalOpen.value = true;
};

const onDelete = (item) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    transactionStore.deleteTransactionById(item.id).then(() => {
      message.value = "거래 내역이 삭제되었습니다.";
      setTimeout(() => {
        message.value = null;
      }, 2000);
    });
  }
};

const fetchTransactions = async () => {
  await transactionStore.fetchTransactions();
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch([viewDate, viewMode], () => {
  currentPage.value = 1;
});
</script>
