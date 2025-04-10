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
              @click="setType('지출')"
            >
              지출
            </button>
            <button
              type="button"
              class="btn"
              :class="type === '수입' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setType('수입')"
            >
              수입
            </button>
          </div>

          <div class="mb-3">
            <input type="date" v-model="date" class="form-control" />
          </div>

          <div class="mb-3">
            <input
              type="text"
              v-model="formattedAmount"
              class="form-control amount-input"
              placeholder="금액을 입력하세요"
            />
          </div>

          <!-- 금액 추가 버튼 -->
          <div class="amount-button-group">
            <button
              v-for="unit in [1000, 10000, 50000, 100000, 1000000]"
              :key="unit"
              type="button"
              class="btn custom-amount-btn"
              @click="addAmount(unit)"
            >
              +{{ unit.toLocaleString() }}
            </button>
          </div>

          <div class="mb-3">
            <select v-model="category" class="form-select">
              <option value="카테고리" disabled>카테고리</option>
              <option
                v-for="(item, index) in currentCategoryList"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
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
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/userStore';

const transactionStore = useTransactionStore();
const userStore = useUserStore();

const emit = defineEmits(['close']);

const type = ref('지출');
const date = ref('');
const amount = ref('');
const category = ref('카테고리');
const memo = ref('');

// 금액 입력란
const formattedAmount = computed({
  get() {
    if (!amount.value) return '';
    return Number(amount.value).toLocaleString() + '원';
  },
  set(val) {
    // ',', '원' 제거하고 숫자만 추출
    const raw = val.replace(/[^\d]/g, '');
    amount.value = raw ? Number(raw) : '';
  },
});

// 금액 입력 버튼
const addAmount = (unit) => {
  const current = Number(amount.value) || 0;
  amount.value = current + unit;
};

// 카테고리 리스트
const expenseCategories = [
  '식비',
  '교통비',
  '주거비',
  '문화생활',
  '의료비',
  '기타',
];
const incomeCategories = ['급여', '용돈', '판매수익', '이자소득', '기타'];

// 현재 카테고리 리스트
const currentCategoryList = computed(() => {
  return type.value === '지출' ? expenseCategories : incomeCategories;
});

// 버튼 누를 때 타입과 카테고리 초기화
const setType = (newType) => {
  type.value = newType;
  category.value = '카테고리';
};

const save = async () => {
  if (category.value === '카테고리') {
    alert('카테고리를 선택해주세요.');
    return;
  }

  console.log('🧪 저장 전 amount:', amount.value, typeof amount.value);

  const transactionData = {
    type: type.value === '수입' ? 'income' : 'expense',
    date: date.value,
    amount: Number(amount.value),
    category: category.value,
    memo: memo.value,
    userId: userStore.user?.id,
  };

  // 거래내역 추가 + 다시 불러오기
  await transactionStore.addTransaction(transactionData);
  await transactionStore.fetchByUser(userStore.user?.id);

  emit('close'); // 모달 닫기
};

// 초기값 설정
setType('지출');
</script>

<style scoped>
.amount-input {
  font-size: 15px;
}

.amount-button-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 4px;
  margin-top: -4px;
  margin-bottom: 16px;
  overflow-x: auto; /* 혹시라도 작을 땐 가로 스크롤 가능 */
}

.custom-amount-btn {
  font-size: xx-small;
  padding: 4px 8px;
  min-width: auto;
  flex: 1; /* 버튼들이 가로 너비 비슷하게 나눠짐 */
  border: 1px solid #4318d1;
  color: #4318d1;
  background-color: white;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.custom-amount-btn:hover {
  background-color: #4318d1;
  color: white;
}
</style>
