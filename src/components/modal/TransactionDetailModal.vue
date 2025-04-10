<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title">{{ formattedDate }} 거래내역</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <div v-if="transactions.length">
            <div
              v-for="item in transactions"
              :key="item.id"
              class="d-flex mb-3 align-items-center position-relative"
            >
              <div class="me-3">
                <div
                  class="category-circle rounded-circle bg-light d-flex justify-content-center align-items-center text-secondary"
                  v-html="formatCategory(item.category)"
                ></div>
              </div>

              <div class="flex-grow-1">
                <div class="fw-bold">{{ item.title }}</div>
                <div class="text-muted small">{{ item.memo }}</div>
              </div>

              <div class="fw-semibold text-end me-2">
                <span
                  :style="{ color: item.type === 'income' ? 'blue' : 'red' }"
                >
                  {{ item.type === 'income' ? '+' : '-'
                  }}{{ Number(item.amount).toLocaleString() }}원
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-4">
            거래내역이 없습니다.
          </div>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn text-white"
            :style="{ backgroundColor: '#4318d1', borderColor: '#4318d1' }"
            @click="$emit('close')"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  date: String,
  transactions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close']);

const formattedDate = computed(() => {
  if (!props.date) return '';
  const [year, month, day] = props.date.split('-');
  return `${year}년 ${month}월 ${day}일`;
});

// ✅ 2글자씩 줄바꿈 처리
const formatCategory = (text) => {
  if (!text) return '';
  if (text.length <= 3) return text; // ✅ 3글자까지는 한 줄로!
  const mid = Math.ceil(text.length / 2);
  return `${text.slice(0, mid)}<br>${text.slice(mid)}`;
};
</script>

<style scoped>
.modal-body {
  max-height: 400px;
  overflow-y: auto;
}

.category-circle {
  width: 36px;
  height: 36px;
  font-size: 0.6rem;
  text-align: center;
  line-height: 1.1;
  word-break: break-all;
  white-space: pre-wrap;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2px;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}
</style>
