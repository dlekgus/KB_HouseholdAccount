
<template>
    <div class="summary-card quick-add">
      <button @click="handleAdd">+</button>
    </div>
  </template>
  
  <script setup>
  function handleAdd() {
    alert('빠른 추가 기능은 개발 중입니다!');
  }
  </script>

  <style scoped>
  .summary-card {
    background: #f9f9f9;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .quick-add button {
    width: 100%;
    height: 50px;
    font-size: 1.5rem;
    background: white;
    border: 2px dashed #ccc;
    border-radius: 10px;
    cursor: pointer;
  }
  </style>
  