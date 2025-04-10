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
      console.log('이번달:', currentMonth);
      const filtered = state.transactions.filter((tx) => {
        console.log('🧾 tx.date:', tx.date);
        const matched =
          tx.type === 'income' && tx.date.startsWith(currentMonth);
        if (matched) console.log('✅ 포함된 수입:', tx);
        return matched;
      });

      return filtered.reduce((sum, tx) => sum + tx.amount, 0);
    },

    // 이번 달 지출
    currentMonthExpense: (state) => {
      const now = new Date();
      const currentMonth = dayjs(now).format('YYYY-MM'); // 'YYYY-MM'

      return state.transactions
        .filter(
          (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
    },

    // 최근 거래 내역

    recentTransactions: (state) => {
      return [...state.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    },
  },

  actions: {
    async fetchByUser(userId) {
      try {
        const res = await axios.get(
          `${BASE_URL}/transactions?userId=${userId}`
        );
        this.transactions = res.data;
        console.log('📦 서버에서 받아온 거래내역:', this.transactions); // 👈 확인!
      } catch (err) {
        console.error('거래내역 로드 실패:', err);
      }
    },
  },
});
