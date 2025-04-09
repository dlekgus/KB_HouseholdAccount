<template>
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="modelValue"
          class="modal fade show d-block"
          tabindex="-1"
          style="background-color: rgba(0, 0, 0, 0.5)"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">고정 지출 추가</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="$emit('update:modelValue', false)"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submit">
                  <div class="mb-3">
                    <label class="form-label">항목명</label>
                    <input v-model="form.name" type="text" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">금액</label>
                    <input v-model.number="form.price" type="number" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">결제일</label>
                    <input
                      v-model.number="form.dueDate"
                      type="number"
                      class="form-control"
                      required
                      min="1"
                      max="31"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">카테고리</label>
                    <select v-model="form.category" class="form-select">
                      <option value="구독">구독</option>
                      <option value="생활비">생활비</option>
                    </select>
                  </div>
  
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">저장</button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="$emit('update:modelValue', false)"
                    >
                      닫기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { useFixedExpenseStore } from '@/store/FixedExpenseStore.js';

  
  defineProps({ modelValue: Boolean });
  const emit = defineEmits(['update:modelValue', 'added']);
  
  const store = useFixedExpenseStore();
  
  const form = reactive({
    name: '',
    price: 0,
    dueDate: 1,
    category: '구독',
  });
  
  const submit = async () => {
    const payload = {
      ...form,
      userId: 1,
    };
  
    await store.addExpense(payload, () => {
      alert('항목이 추가되었습니다!');
      emit('added');
      emit('update:modelValue', false);
    });
  };
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
  