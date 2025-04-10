<template>
    <div>
      <!-- ✅ 플로팅 버튼 -->
      <button class="floating-add-btn" @click="isOpen = true">
        <i class="fa-solid fa-plus"></i>
      </button>
  
      <!-- ✅ 추가 모달 -->
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
  
  <style scoped>
  .floating-add-btn {
    position: fixed;
    bottom: 76px;
    right: 20px;
    background-color: #2306a7;
    color: white;
    border: none;
    border-radius: 10%;
    width: 46px;
    height: 46px;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }
  
  .floating-add-btn:hover {
    background-color: #4f3abc;
  }
  </style>
  