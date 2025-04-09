import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = '/api';
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser(id) {
      try {
        const res = await axios.get(`${BASE_URL}/users/${id}`);
        this.user = res.data;
        console.log(localStorage.getItem('userId'));
      } catch (error) {
        console.log('유저 조회 실패', error);
        this.user = null;
      }
    },
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('userId', userData.id);
    },
    logout() {
      this.user = null;
      localStorage.removeItem('userId');
    },
    async deleteUser() {
      //현재 로그인된 유저 정보가 없으면 함수 종료
      if (!this.user) return;
      await axios.delete(`${BASE_URL}/users/${this.user.id}`);
      this.logout();
    },
  },
});
