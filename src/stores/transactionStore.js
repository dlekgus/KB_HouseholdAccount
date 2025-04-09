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

    async addTransaction(transaction) {
      try {
        const res = await axios.post(`${BASE_URL}/transactions`, transaction);
        this.transactions.push(res.data); // 응답 데이터를 반영 (반응성 유지)
      } catch (err) {
        console.error('거래내역 저장 실패:', err);
      }
    },
  },
});
