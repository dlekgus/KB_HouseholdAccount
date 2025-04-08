
<script setup>
import { computed } from 'vue';
const props = defineProps({
  subscriptions: Array,
  userId: Number
});

const filteredList = computed(() =>
  props.subscriptions.filter(
    s => s.userId === props.userId && s.category === '고정지출'
  )
);
</script>

<template>
  <div class="list-section">
    <h4>구독 목록</h4>
    <div
      class="list-item"
      v-for="item in filteredList"
      :key="item.id"
    >
      <div>
        <strong>{{ item.name }}</strong>
        <p class="date">매월 {{ item.dueDate }}일</p>
      </div>
      <span class="amount">{{ item.price.toLocaleString() }}원</span>
    </div>
  </div>
</template>

<style scoped>
.list-section {
  margin-top: 2rem;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.date {
  font-size: 0.9rem;
  color: #888;
  margin: 0;
}
.amount {
  font-weight: bold;
}
</style>
