<script setup>
import { computed } from 'vue';
const props = defineProps({
  subscriptions: Array,
  userId: Number
});

const fixedExpenses = computed(() =>
  props.subscriptions.filter(
    s => s.userId === props.userId && s.category === '고정지출'
  )
);
const totalFixed = computed(() =>
  fixedExpenses.value.reduce((sum, s) => sum + s.price, 0)
);
const upcoming = computed(() =>
  props.subscriptions
    .filter(s => s.userId === props.userId)
    .sort((a, b) => a.dueDate - b.dueDate)
);

function getDotColor(name) {
  const map = {
    '통신비': 'orange',
    'Netflix': 'red',
    '멜론': 'green',
    '헬스장': 'skyblue',
  };
  return map[name] || 'gray';
}
</script>

<template>
  <div>
    <div class="summary-card">
      <p>이번 달 총 구독료</p>
      <h2>{{ totalFixed.toLocaleString() }}원</h2>
    </div>

    <div class="summary-card">
      <p>다가오는 결제</p>
      <ul>
        <li v-for="item in upcoming" :key="item.id">
          <span :style="{ color: getDotColor(item.name) }">●</span>
          {{ item.name }} {{ item.dueDate }}일
          <span class="amount">{{ item.price.toLocaleString() }}원</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  background: #f9f9f9;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.summary-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.summary-card li {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}
.amount {
  font-weight: bold;
}
</style>
