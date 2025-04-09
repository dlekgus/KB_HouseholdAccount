// src/stores/fixedExpenseStore.js
import { defineStore } from "pinia";
import axios from "axios";
import { reactive, computed, ref } from "vue";

export const useFixedExpenseStore = defineStore("fixedExpense", () => {
  const BASEURI = "api/subscriptions";

  const state = reactive({
    fixedExpenses: [],
    isLoading: false,
  });

  const colorPairs = [
    { boxColor: "#fcecec", dotColor: "#e74c3c" },
    { boxColor: "#f1f9fa", dotColor: "#52a8c9" },
    { boxColor: "#fff7ec", dotColor: "#f2992e" },
    { boxColor: "#f1f9f3", dotColor: "#64c364" },
  ];

  const fetchExpenses = async () => {
    state.isLoading = true;
    try {
      const res = await axios.get(BASEURI, {
        params: { userId: 3 },
      });
      state.fixedExpenses = res.data;
    } catch (err) {
      alert("조회 실패: " + err);
    } finally {
      state.isLoading = false;
    }
  };

  const addExpense = async (expense, callback) => {
    try {
      const res = await axios.post(BASEURI, expense);
      if (res.status === 201) {
        state.fixedExpenses.push(res.data);
        callback?.();
      }
    } catch (err) {
      alert("추가 실패: " + err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASEURI}/${id}`);
      const index = state.fixedExpenses.findIndex((e) => e.id === id);
      if (index !== -1) state.fixedExpenses.splice(index, 1);
    } catch (err) {
      alert("삭제 실패: " + err);
    }
  };

  const totalAmount = computed(() =>
    state.fixedExpenses.reduce((sum, e) => sum + Number(e.price || 0), 0)
  );

  const isAddModalOpen = ref(false);

  const openAddModal = () => {
    isAddModalOpen.value = true;
  };

  const closeAddModal = () => {
    isAddModalOpen.value = false;
  };

  return {
    fixedExpenses: computed(() => state.fixedExpenses),
    isLoading: computed(() => state.isLoading),
    colorPairs,
    fetchExpenses,
    addExpense,
    deleteExpense,
    totalAmount,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
  };
});
