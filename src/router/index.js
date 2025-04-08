import Details from '@/pages/Details.vue';
import FixedExpenses from '@/pages/FixedExpenses.vue';
import Home from '@/pages/Home.vue';
import Mypage from '@/pages/Mypage.vue';
import Login from '@/pages/Login.vue';
import Signup from '@/pages/Signup.vue';

import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/details',
      name: 'details',
      component: Details,
    },
    {
      path: '/fixedExpenses',
      name: 'fixedExpenses',
      component: FixedExpenses,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
    },
  ],
});

export default router;
