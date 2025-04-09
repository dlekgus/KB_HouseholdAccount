import { defineStore } from 'pinia';
import axios from 'axios';
import { computed } from 'vue';

const BASE_URL = '/api';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
  }),
  actions: {
    async fetchByUser(userId) {
      try {
        const res = await axios.get(
          `${BASE_URL}/transactions?userId=${userId}`
        );
        this.transactions = res.data;
      } catch (err) {
        console.error('거래내역 로드 실패:', err);
      }
    },
  },
});
