<template>
    <div class="card shadow-sm p-4 h-100">
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="text-muted">이번 달 총 구독료</h6>
          <i class="bi bi-bag-check fs-4 text-success"></i>
        </div>
        <h2 class="fw-bold">{{ totalPrice.toLocaleString() }}원</h2>
      </div>

    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  const props = defineProps({ subscriptions: Array });
  const emit = defineEmits(['openAdd']);
  const totalPrice = computed(() =>
    props.subscriptions?.reduce((sum, s) => sum + s.price, 0)
  );
  const openAdd = () => emit('openAdd');
  </script>
  