<template>
  <div class="card shadow-sm p-4">
    <h6 class="text-muted mb-3">구독 목록</h6>
    <FixedExpenseItem
      v-for="s in subscriptions"
      :key="s.name"
      :item="s"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import FixedExpenseItem from './FixedExpenseItem.vue';

defineProps({
  subscriptions: {
    type: Array,
    required: true,
  },
});

function handleEdit(item) {
  console.log('✏️ 수정할 항목:', item);
  // 모달 열기 or 편집 페이지로 이동 등
}

function handleDelete(item) {
  console.log('🗑️ 삭제할 항목:', item);
  // 삭제 로직 실행
}
</script>
