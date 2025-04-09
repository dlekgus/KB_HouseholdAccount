<template>
    <span>{{ displayValue }}</span>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  
  const props = defineProps({
    value: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 1000, // 1초 애니메이션
    },
  });
  
  const displayValue = ref('0');
  let startTimestamp = null;
  let animationFrameId = null;
  
  const animate = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = timestamp - startTimestamp;
    const progressRatio = Math.min(progress / props.duration, 1);
    const current = Math.floor(props.value * progressRatio);
    displayValue.value = current.toLocaleString();
  
    if (progress < props.duration) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };
  
  watch(
    () => props.value,
    () => {
      cancelAnimationFrame(animationFrameId);
      startTimestamp = null;
      requestAnimationFrame(animate);
    },
    { immediate: true }
  );
  </script>
  