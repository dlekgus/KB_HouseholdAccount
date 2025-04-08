<template>
    <div class="card shadow-sm p-4 h-100 d-flex align-items-center justify-content-center" style="cursor: pointer"
        @click="isOpen = true">
        <h6 class="text-muted mb-2">빠른 추가</h6>
        <div class="border rounded w-100 d-flex align-items-center justify-content-center" style="height: 100px">
            <span class="fs-2 text-muted">+</span>
        </div>

        <FixedExpenseAddModal v-model="isOpen" @added="fetchSubscriptions" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
import FixedExpenseAddModal from '../modal/FixedExpenseAddModal.vue'

const isOpen = ref(false)

const fetchSubscriptions = async () => {
    const res = await axios.get('http://localhost:3000/subscriptions?userId=1')
    subscriptions.value = res.data
}
</script>