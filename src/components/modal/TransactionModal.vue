<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title">거래내역 추가</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <div class="btn-group mb-3 w-100" role="group">
            <button
              type="button"
              class="btn"
              :class="type === '지출' ? 'btn-primary' : 'btn-outline-primary'"
              @click="type = '지출'"
            >
              지출
            </button>
            <button
              type="button"
              class="btn"
              :class="type === '수입' ? 'btn-primary' : 'btn-outline-primary'"
              @click="type = '수입'"
            >
              수입
            </button>
          </div>

          <div class="mb-3">
            <input type="date" v-model="date" class="form-control" />
          </div>

          <div class="mb-3">
            <input
              type="number"
              v-model="amount"
              class="form-control"
              placeholder="금액을 입력하세요"
            />
          </div>

          <div class="mb-3">
            <select v-model="category" class="form-select">
              <option value="식비">식비</option>
              <option value="교통비">교통비</option>
              <!-- 필요시 추가 -->
            </select>
          </div>

          <div class="mb-3">
            <input
              type="text"
              v-model="memo"
              class="form-control"
              placeholder="메모를 입력하세요"
            />
          </div>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            취소
          </button>
          <button type="button" class="btn btn-primary" @click="save">
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const type = ref('지출');
const date = ref('');
const amount = ref('');
const category = ref('식비');
const memo = ref('');

const save = () => {
  // 저장 로직 작성
  console.log({ type, date, amount, category, memo });
  emit('close');
};
</script>
