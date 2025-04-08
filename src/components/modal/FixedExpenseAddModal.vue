
<template>
    <teleport to="body">
      <transition name="fade">
        <div v-if="modelValue" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">빠른 항목 추가</h5>
                <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
              </div>
              <div class="modal-body">
                <p>여기에 항목 입력 폼이 들어갑니다.</p>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">닫기</button>
                <button class="btn btn-primary">저장</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </template>
  
  <script setup>
  defineProps({
    modelValue: Boolean,
  })
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  