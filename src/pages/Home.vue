<!-- 소비 캘린더 -->
<!-- 이번달 수입/지출 -->
<!-- 최근 거래 -->

<script setup>
import Calendar from '@/components/Calendar.vue';
import HomeLayout from '@/components/HomeLayout.vue';
import RecentHistory from '@/components/RecentHistory.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div>
    <HomeLayout>
      <template v-slot:calendar>
        <Calendar />
      </template>

      <template v-slot:history>
        <RecentHistory></RecentHistory>
      </template>

      <template v-slot:footer>
        <Footer />
      </template>

      <template v-slot:fab>
        <button class="btn btn-outline">
          ➕
          <!-- <font-awesome-icon :icon="['fas', 'circle-plus']" /> -->
        </button>
      </template>
    </HomeLayout>
  </div>
</template>
