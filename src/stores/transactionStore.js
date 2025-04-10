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
        console.log('📦 서버에서 받아온 거래내역:', this.transactions); // 👈 확인!
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
