<script setup>
import { ref, onMounted } from "vue";
import Calendar from "@/components/Calendar.vue";
import HomeLayout from "@/components/layouts/HomeLayout.vue";
import RecentHistory from "@/components/RecentHistory.vue";
import ThisMonthHistory from "@/components/ThisMonthHistory.vue";
import Footer from "@/components/Footer.vue";
import TransactionModal from "@/components/modal/TransactionModal.vue";
import UpcomingToast from "@/components/UpcomingToast.vue";

const showModal = ref(false);
const seenFixedToast = ref(false);

onMounted(() => {
  const fixedToast = localStorage.getItem("fixedToast");
  if (fixedToast) {
    seenFixedToast.value = false;
  } else {
    seenFixedToast.value = true;
    localStorage.setItem("fixedToast", "true");
  }
});
</script>

<template>
  <div>
    <UpcomingToast v-if="seenFixedToast" />
    <HomeLayout>
      <template v-slot:calendar>
        <Calendar />
      </template>

      <template v-slot:recent-history>
        <RecentHistory></RecentHistory>
      </template>

      <template v-slot:this-month-history>
        <ThisMonthHistory></ThisMonthHistory>
      </template>

      <template v-slot:footer>
        <Footer />
      </template>

      <template v-slot:fab>
        <button class="btn btn-outline" @click="showModal = true">+</button>
        <TransactionModal
          v-if="showModal"
          @close="showModal = false"
        ></TransactionModal>
      </template>
    </HomeLayout>
  </div>
</template>

<style scoped>
button {
  background-color: #4318d1;
  color: white;
  font-weight: bolder;
  font-size: large;
}
</style>
