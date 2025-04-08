<template>
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="modelValue"
          class="modal fade show d-block"
          tabindex="-1"
          style="background-color: rgba(0, 0, 0, 0.5);"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <!-- 헤더 -->
              <div class="modal-header">
                <h5 class="modal-title">구독 항목 추가</h5>
                <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
              </div>
  
              <!-- 바디 -->
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label class="form-label">이름</label>
                    <input type="text" class="form-control" placeholder="예: 넷플릭스" />
                  </div>
  
                  <div class="mb-3">
                    <label class="form-label">금액</label>
                    <input type="number" class="form-control" placeholder="예: 17000" />
                  </div>
  
                  <div class="mb-3">
                    <label class="form-label">납부일</label>
                    <input type="number" min="1" max="31" class="form-control" placeholder="1~31" />
                  </div>
  
                  <div class="mb-3">
                    <label class="form-label">카테고리</label>
                    <select class="form-select">
                      <option selected disabled>선택하세요</option>
                      <option value="구독">구독</option>
                      <option value="생활">생활</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </form>
              </div>
  
              <!-- 푸터 -->
              <div class="modal-footer">
                <button class="btn btn-primary">저장</button>
                <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">닫기</button>
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
  