<template>
    <div class="card shadow-sm p-4 h-100">
        <h6 class="text-muted mb-3">다가오는 결제</h6>
        <div class="scroll-area">
            <div v-for="item in subscriptions" :key="item.name" class="d-flex justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2">
                    <span :style="{ color: item.dotColor, fontSize: '0.7rem' }">●</span>
                    <span>{{ item.name }}</span>
                </div>
                <div>
                    <small class="text-muted me-2">{{ item.day }}일</small>
                    <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    subscriptions: Array,
});
const upcoming = props.subscriptions.map((s) => ({
    ...s,
    color: s.color || 'gray',
}));
</script>

<style scoped>
.scroll-area {
  max-height: 250px; /* 원하는 높이로 조정 가능 */
  overflow-y: auto;
  padding-right: 6px;
}

.scroll-area::-webkit-scrollbar {
  width: 6px;
}
.scroll-area::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
.scroll-area::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>