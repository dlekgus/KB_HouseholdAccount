<template>
    <div class="card shadow-sm p-4 h-100">
      <h6 class="text-muted mb-3">다가오는 결제</h6>
      <div v-for="item in subscriptions" :key="item.name" class="d-flex justify-content-between mb-2">
        <div class="d-flex align-items-center gap-2">
          <span :style="{ color: item.dotColor, fontSize: '0.7rem' }">●</span>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <small class="text-muted me-2">{{ item.day }}일</small>
          <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    subscriptions: Array,
  });
  const upcoming = props.subscriptions.map((s) => ({
    ...s,
    color: s.color || 'gray',
  }));
  </script>
  