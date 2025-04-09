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
                <!-- ✅ 카테고리 토글 -->
                <div class="mb-4">
                  <div class="category-toggle">
                    <button
                      v-for="option in categoryOptions"
                      :key="option"
                      type="button"
                      class="toggle-button"
                      :class="{ active: form.category === option }"
                      @click="form.category = option"
                    >
                      {{ option }}
                    </button>
                  </div>
                </div>

                <!-- ✅ 폼 영역 -->
                <div class="row">
                  <!-- 좌: 입력 -->
                  <div class="col-md-5" style="margin-top: 25px;">
                    <div class="mb-3">
                      <label class="form-label">항목명</label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control form-control-sm"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">금액</label>
                      <input
                        v-model="displayPrice"
                        type="text"
                        class="form-control form-control-sm"
                        @input="onPriceInput"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">결제일</label>
                      <select
                        v-model.number="form.dueDate"
                        class="form-select form-select-sm" 
                      >
                        <option v-for="n in 31" :key="n" :value="n">{{ n }}일</option>
                      </select>
                    </div>
                  </div>

                  <!-- 우: 아이콘 -->
                  <div class="col-md-7" style="margin-bottom: 40px;">
                    <label class="form-label"></label>
                    <div class="icon-grid">
                      <div
                        v-for="icon in iconList"
                        :key="icon.label"
                        class="icon-box"
                        :class="{ selected: form.icon?.label === icon.label }"
                        @click="toggleIcon(icon)"
                      >
                        <i :class="icon.class" :style="icon.style" class="fa-lg"></i>
                      </div>
                    </div>
                  </div>
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
import { reactive, ref, watch } from 'vue';
import { useFixedExpenseStore } from '@/stores/FixedExpenseStore.js';

defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue', 'added']);
const store = useFixedExpenseStore();
const userId = localStorage.getItem('userId');

const categoryOptions = ['구독', '고정지출'];

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

const displayPrice = ref('0');

watch(
  () => form.price,
  (val) => {
    displayPrice.value = Number(val).toLocaleString();
  }
);

const onPriceInput = (e) => {
  const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
  form.price = Number(onlyNumber);
  displayPrice.value = Number(onlyNumber).toLocaleString();
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 카테고리 토글 스타일 */
.category-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 2px solid #4f2ee8;
  border-radius: 12px;
  overflow: hidden;
  height: 49px;
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

/* 아이콘 그리드 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
  gap: 10px;
  margin-top: 10px;
}

.icon-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-box:hover {
  background-color: #f9f9f9;
}

.icon-box.selected {
  background-color: #e0e7ff;
}
</style>
