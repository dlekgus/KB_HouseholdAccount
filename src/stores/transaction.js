import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import {
  addTransactionAPI,
  fetchTransactionsByDateRangeAPI,
  deleteTransactionAPI,
  updateTransactionAPI,
} from "@/services/transactionAPI";

export const useTransactionStore = defineStore("transactions", () => {
  const userStore = useUserStore();
  const router = useRouter();

  const viewDate = ref(dayjs());
  const viewMode = ref("월간");
  const transactions = ref([]);
  const isLoading = ref(false);

  const getUserId = () => {
    return userStore.user?.id || localStorage.getItem("userId");
  };

  const setViewDate = (date) => {
    viewDate.value = dayjs(date);
  };

  const setViewMode = (mode) => {
    viewMode.value = mode;
  };

  const fetchTransactions = async () => {
    const userId = getUserId();
    if (!userId) {
      router.push("/");
      return;
    }

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

    isLoading.value = true;

    try {
      const { data } = await fetchTransactionsByDateRangeAPI({
        userId,
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        page: 1,
        limit: 10000,
      });
      transactions.value = data;
    } catch (err) {
      console.error("거래 내역 로딩 실패", err);
    }

    isLoading.value = false;
  };

  const deleteTransactionById = async (id) => {
    try {
      await deleteTransactionAPI(id);
      transactions.value = transactions.value.filter((tx) => tx.id !== id);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const addTransaction = async (transaction) => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      router.push("/");
      return;
    }

    try {
      const res = await addTransactionAPI({
        ...transaction,
        userId: currentUserId,
      });

      const addedTx = res.data;
      const txDate = dayjs(addedTx.date);
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

      const inRange = txDate.isSameOrAfter(start) && txDate.isSameOrBefore(end);
      if (inRange) {
        transactions.value.push(addedTx);
      }
    } catch (err) {
      console.error("추가 실패", err);
    }
  };

  const updateTransactionById = async (id, updatedData) => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      router.push("/");
      return;
    }

    if (updatedData.userId && updatedData.userId !== currentUserId) {
      alert("현재 사용자와 다른 사용자의 거래는 수정할 수 없습니다.");
      return;
    }

    try {
      const res = await updateTransactionAPI(id, updatedData);
      const index = transactions.value.findIndex((tx) => tx.id === id);
      if (index !== -1) {
        transactions.value[index] = res.data;
        console.log("수정된 거래:", res.data);
      }
    } catch (err) {
      console.error("수정 실패", err);
    }
  };

  watch([viewDate, viewMode], fetchTransactions, { immediate: true });

  return {
    viewDate,
    viewMode,
    setViewDate,
    setViewMode,
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    deleteTransactionById,
    updateTransactionById,
  };
});
