<template>
  <div class="container my-5">
    <h5 class="fw-bold mb-2">구독 관리</h5>
    <p class="text-muted">고정 지출 내역을 관리하세요</p>

    <!-- 상단 카드 3개 -->
    <div class="row g-3 mb-4">
      <div class="col-lg-4">
        <FixedExpenseSum :subscriptions="subscriptions" @openAdd="openAdd" />
      </div>
      <div class="col-lg-4">
        <FixedUpcoming :subscriptions="subscriptions" />
      </div>
      <div class="col-lg-4">
        <FixedExpenseQuickAdd/>
      </div>
    </div>

    <!-- 구독 목록 -->
    <FixedExpenseList :subscriptions="subscriptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import FixedExpenseSum from '@/components/fixedExpenses/FixedExpenseSum.vue';
import FixedUpcoming from '@/components/fixedExpenses/FixedUpcoming.vue';
import FixedExpenseList from '@/components/fixedExpenses/FixedExpenseList.vue';
import FixedExpenseQuickAdd from '@/components/fixedExpenses/FixedExpenseQuickAdd.vue';

const subscriptions = ref([]);

const colorPairs = [
  { boxColor: '#fcecec', dotColor: '#e74c3c' },
  { boxColor: '#f1f9fa', dotColor: '#52a8c9' },
  { boxColor: '#fff7ec', dotColor: '#f2992e' },
  { boxColor: '#f1f9f3', dotColor: '#64c364' },
];

const fetchSubscriptions = async () => {
  try {
    const res = await axios.get('http://localhost:3000/subscriptions?userId=1');
    subscriptions.value = res.data.map(item => {
      const randomColor = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      return {
        ...item,
        name: item.name,
        price: item.price,
        day: item.dueDate,
        ...randomColor
      };
    });
  } catch (err) {
    console.error('구독 정보 가져오기 실패:', err);
  }
};

onMounted(() => {
  fetchSubscriptions();
});

const openAdd = () => {
  alert('추가 기능 열기!');
};
</script>
