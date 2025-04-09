<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Header from '@/components/Header.vue';
import { reactive } from 'vue';
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style lang="scss">
@use "@/assets/main.scss";
</style>
