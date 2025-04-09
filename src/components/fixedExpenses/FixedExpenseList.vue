<template>
  <div class="card shadow-sm p-4">
    <h6 class="text-muted mb-3">구독 목록</h6>
    <FixedExpenseItem
      v-for="s in subscriptions"
      :key="s.id"
      :item="s"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
  import { useFixedExpenseStore } from '@/store/FixedExpenseStore.js';
import FixedExpenseItem from './FixedExpenseItem.vue';

defineProps({
  subscriptions: {
    type: Array,
    required: true,
  },
});

const store = useFixedExpenseStore();

function handleEdit(item) {
  console.log('✏️ 수정할 항목:', item);
  store.openAddModal(); // 모달 열기
  // 필요 시 store.selectedItem = item; 추가
}

function handleDelete(item) {
  if (confirm(`정말로 '${item.name}'을(를) 삭제하시겠습니까?`)) {
    store.deleteExpense(item.id);
  }
}
</script>
