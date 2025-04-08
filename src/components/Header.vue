<template>
  <nav class="navbar navbar-expand-sm bg-light navbar-light">
    <span class="navbar-brand ps-2">KB 가계부</span>
    <button
      class="navbar-toggler"
      type="button"
      @click="isNavShow = !isNavShow"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div
      :class="
        isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
      "
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/details">details</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/fixedExpenses"
            >fixedExpenses</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/analysis">통계</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/mypage">Mypage</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
const isNavShow = ref(false);
</script>

<style scoped></style>
