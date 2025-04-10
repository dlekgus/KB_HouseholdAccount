<!-- FixedExpenseAddModal.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">구독 고정지출 추가</h5>
              <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submit">
                <!-- 카테고리 토글 -->
                <div class="mb-4" style="margin-top: 4px;">
                  <div class="category-toggle">
                    <button v-for="option in categoryOptions" :key="option" type="button" class="toggle-button"
                      :class="{ active: form.category === option }" @click="form.category = option">
                      {{ option }}
                    </button>
                  </div>
                </div>
                <hr />

                <!-- 폼 영역 -->
                <!-- <div class="row"> -->
                  <!-- 좌: 입력 -->
                  <!-- <div class="col-md-8" style="margin-top: 4px;"> -->
                    <div class="mb-3">
                      <input v-model="form.name" type="text" class="form-control form-control-sm custom-input" required
                        placeholder="항목명을 입력하세요." />
                    </div>

                    <div class="mb-3 position-relative price-wrapper">
                      <input v-model="displayPrice" type="text" class="form-control form-control-sm price-input"
                        @input="onPriceInput" required placeholder="금액을 입력하세요." />
                      <span class="unit-text">원</span>
                    </div>


                    <div class="mb-3">
                      <label class="form-label"></label>
                      <v-select v-model="form.dueDate" :options="dayOptions" :reduce="day => day"
                        placeholder="날짜를 선택하세요" class="custom-select" />
                    </div>
                  <!-- </div> -->

                  <!-- 우: 아이콘 -->
                  <!-- <div class="col-md-4 scroll-area flex-grow-1" style="margin-bottom: 40px;"> -->
                    <label class="form-label"></label>
                    <div class="icon-grid">
                      <div v-for="icon in iconList" :key="icon.label" class="icon-box"
                        :class="{ selected: form.icon?.label === icon.label }" @click="toggleIcon(icon)">
                        <i :class="icon.class" :style="icon.style" class="fa-lg"></i>
                      </div>
                    </div>
                  <!-- </div> -->
                <!-- </div> -->

                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">저장</button>
                  <button type="button" class="btn btn-secondary" @click="ret">
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
import { reactive, ref, watch } from 'vue';
import { useFixedExpenseStore } from '@/stores/FixedExpenseStore.js';

defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue', 'added']);
const store = useFixedExpenseStore();
const userId = localStorage.getItem('userId');

const categoryOptions = ['구독', '고정지출'];
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1); // [1,2,...31] -> v-Select
const iconList = [
  { label: 'music', class: 'fa-solid fa-headphones', style: 'color: #002feb;' },
  { label: 'youtube', class: 'fa-brands fa-youtube', style: 'color: #e61700;' },
  { label: 'car', class: 'fa-solid fa-car', style: 'color: #4909fb;' },
  { label: 'mark', class: 'fa-solid fa-bookmark', style: 'color: #191032;' },
  { label: 'hand', class: 'fa-solid fa-hand-holding-heart', style: 'color: #ffea05;' },
  { label: 'insurance', class: 'fa-solid fa-gamepad', style: 'color: #007007;' },
  { label: 'phone', class: 'fa-solid fa-phone', style: 'color: #085941;' },
  { label: 'house', class: 'fa-solid fa-house', style: 'color : #74C0FC;' },
];

const form = reactive({
  name: '',
  price: 0,
  dueDate: 1,
  category: categoryOptions[0],
  icon: null,
});
const ret = () => {
  emit('update:modelValue', false);
  displayPrice.value = '';
  form.dueDate = '';
  form.name = '';

}

const displayPrice = ref('');

watch(
  () => form.price,
  (val) => {
    displayPrice.value = Number(val).toLocaleString();
  }
);



const onPriceInput = (e) => {
  const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
  form.price = Number(onlyNumber);
  if (displayPrice.value == 0) displayPrice.value = '';
  else {
    displayPrice.value = Number(onlyNumber).toLocaleString();
  }
};

const toggleIcon = (icon) => {
  if (form.icon?.label === icon.label) {
    form.icon = null;
  } else {
    form.icon = icon;
  }
};

const submit = async () => {
  const payload = {
    ...form,
    userId,
  };

  await store.addExpense(payload, () => {
    alert('항목이 추가되었습니다!');
    emit('added');
    emit('update:modelValue', false);
  });
};
</script>

<style scoped>

.scroll-area {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
}

.custom-select {
  max-height: 40px;
  font-size: 14px;
}

.custom-select :hover {
  cursor: pointer;
}

.vs__dropdown-menu {
  max-height: 40px;
  overflow-y: auto;
}

/*  전체 row 간격 줄이기 */
.row {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 268px;
}

/* 입력창 간 여백 최소화 */
.mb-3 {
  margin-top: 25px;
}

::placeholder {
  color: rgb(184, 180, 180);
  font-size: 15px;
}

.price-wrapper {
  position: relative;
}

.unit-text {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.9rem;
  pointer-events: none;
}


.price-input {
  font-size: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 카테고리 토글 */
.category-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #4f2ee8;
  border-radius: 9px;
  overflow: hidden;
  height: 48px;
  text-align: center;
  font-size: 10%;
}

.toggle-button {
  padding: 12px 0;
  background: white;
  border: none;
  font-weight: bold;
  color: #4f2ee8;
  transition: all 0.3s ease-in-out;
  font-size: 16px;
}

.toggle-button.active {
  background: #4f2ee8;
  color: white;
}

.toggle-button:hover {
  background: #4f2ee8;
  color: white;
}

/* 인풋 포커스 및 스타일 */
.custom-input {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  transition: border-color 0.2s ease-in-out;
}

.custom-input:focus {
  border-color: #6f42c1;
  /* 보라색 */
  box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.25);
}

/* 아이콘 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(1, auto);
  gap: 10px;
  margin-bottom: 15px;
}

.icon-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
@media(max-width:800px) {
  .icon-box {
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }
  .icon-grid{
    
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(1, auto);

  }
}
.icon-box:hover {
  background-color: #f9f9f9;
}

.icon-box.selected {
  background-color: #e0e7ff;
}
</style>
