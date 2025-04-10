<template>
  <div class="card border p-4 rounded-4 shadow-sm bg-white">
    <div class="placeholder-glow mb-4">
      <span class="placeholder col-3"></span>
    </div>

    <div class="px-4 d-flex border-start border-bottom border-2">
      <div
        class="flex-grow-1 ps-3 d-flex justify-content-between align-items-end"
        style="height: 130px"
      >
        <div v-for="i in 5" :key="'bar-' + i" class="">
          <!-- 막대 -->
          <div
            class="placeholder rounded"
            :style="{
              height: `${40 + (i % 4) * 20}px`,
              width: '14px',
              backgroundColor: '#e9ebee',
              animation: 'pulse 1.5s infinite ease-in-out',
            }"
          ></div>
          <div
            class="placeholder rounded align-bottom"
            :style="{
              height: `${20 + (i % 4) * 10}px`,
              width: '14px',
              backgroundColor: '#e9ebee',
              animation: 'pulse 1.5s infinite ease-in-out',
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 라벨 영역 (카드 내부에 바짝 붙게) -->
    <div class="px-4 mt-2 d-flex justify-content-between">
      <div
        v-for="i in 5"
        :key="'label-' + i"
        class="placeholder rounded"
        style="width: 30px; height: 10px; background-color: #e9ebee"
      ></div>
    </div>

    <!-- Legend -->
    <div class="d-flex justify-content-center mt-4 gap-3">
      <div class="d-flex align-items-center gap-2">
        <div
          class="rounded-pill"
          style="width: 1rem; height: 1rem; background-color: #e9ebee"
        ></div>

        <div
          class="rounded-pill"
          style="width: 3rem; height: 1rem; background-color: #e9ebee"
        ></div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div
          class="rounded-pill"
          style="width: 1rem; height: 1rem; background-color: #e9ebee"
        ></div>
        <div
          class="rounded-pill"
          style="width: 3rem; height: 1rem; background-color: #e9ebee"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>