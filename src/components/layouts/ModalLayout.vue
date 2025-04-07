<!-- components/Modal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    style="z-index: 2000"
  >
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <button class="absolute top-4 right-4" @click="$emit('close')">✖</button>
      <slot />
    </div>
  </div>
</template>
