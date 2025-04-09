import { defineStore } from 'pinia';
import axios from 'axios';
import dayjs from 'dayjs';
import { constrainPoint } from '@fullcalendar/core/internal';

const BASE_URL = '/api';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
  }),

  getters: {
    currentMonthIncome: (state) => {
      const now = new Date();
      const currentMonth = dayjs(now).format('YYYY-MM'); // 'YYYY-MM'
      const filtered = state.transactions.filter((tx) => {
        const matched =
          tx.type === 'income' && tx.date.startsWith(currentMonth);
        if (matched) return matched;
      });

      return filtered.reduce((sum, tx) => sum + tx.amount, 0);
    },

    // 이번 달 지출
    currentMonthExpense: (state) => {
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'

      return state.transactions
        .filter(
          (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
    },
  },

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
