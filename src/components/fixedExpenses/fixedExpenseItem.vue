<template>
  <div class="d-flex justify-content-between align-items-center py-3 border-bottom position-relative">
    <div class="d-flex align-items-center gap-3">
      <div
        :style="getBoxStyle(item.boxColor)"
        class="rounded-4 d-flex align-items-center justify-content-center me-3"
        style="width: 40px; height: 40px;"
      >
        <span :style="getDotStyle(item.dotColor)" class="rounded-circle"></span>
      </div>
      <div>
        <div class="fw-semibold">{{ item.name }}</div>
        <div class="text-muted small">매월 {{ item.day }}일</div>
      </div>
    </div>

    <!-- 오른쪽 가격 + 점 세 개 -->
    <div class="d-flex align-items-center gap-2">
      <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>
      <div class="dropdown-container" @click.stop="toggleMenu">
        <span style="cursor: pointer;">⋮</span>
        <div v-if="showMenu" class="custom-dropdown">
          <div @click="editItem" class="dropdown-item">수정</div>
          <div @click="deleteItem" class="dropdown-item">삭제</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const editItem = () => {
  emit('edit', props.item);
  showMenu.value = false;
};

const deleteItem = () => {
  emit('delete', props.item);
  showMenu.value = false;
};

function getBoxStyle(color) {
  return {
    backgroundColor: color || '#fcecec',
  };
}

function getDotStyle(color) {
  return {
    width: '10px',
    height: '10px',
    backgroundColor: color || '#e74c3c',
  };
}
</script>

<style scoped>
.custom-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  z-index: 10;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
