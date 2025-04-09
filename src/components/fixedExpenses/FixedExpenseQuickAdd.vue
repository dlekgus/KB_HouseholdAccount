<template>
    <div
      class="card shadow-sm p-4 h-85 d-flex align-items-center justify-content-center"
      style="cursor: pointer"
      @click="isOpen = true"
    >
      <h6 class="text-muted mb-2">빠른 추가</h6>
      <div class="border rounded w-100 d-flex align-items-center justify-content-center" style="height: 100px">
        <span class="fs-2 text-muted">+</span>
      </div>
  
      <FixedExpenseAddModal v-model="isOpen" @added="handleAdded" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useFixedExpenseStore } from '@/stores/FixedExpenseStore.js';
  import FixedExpenseAddModal from '../modal/FixedExpenseAddModal.vue';
  
  const isOpen = ref(false);
  const store = useFixedExpenseStore();
  
  const handleAdded = () => {
    store.fetchExpenses(); // 새로고침해서 리스트 최신화
  };
  </script>
  