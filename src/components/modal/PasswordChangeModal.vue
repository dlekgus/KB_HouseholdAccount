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
          <h5 class="modal-title">비밀번호 변경</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">현재 비밀번호</label>
            <input
              type="password"
              v-model="currentPassword"
              class="form-control"
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">새 비밀번호</label>
            <input
              type="password"
              v-model="newPassword"
              class="form-control"
              placeholder="새 비밀번호를 입력하세요"
            />
            <div class="form-text">영문, 숫자, 특수문자 포함 8자 이상</div>
          </div>

          <div class="mb-3">
            <label class="form-label">새 비밀번호 확인</label>
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              placeholder="새 비밀번호를 다시 입력하세요"
              @keyup.enter="changePassword"
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
          <button type="button" class="btn btn-primary" @click="changePassword">
            변경하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
const emit = defineEmits(['close']);
const userStore = useUserStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const props = defineProps({
  userId: Number,
});

const changePassword = async () => {
  if (newPassword.value.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다.');
    return;
  }

  try {
    await userStore.changePassword(currentPassword.value, newPassword.value);
    alert('비밀번호 변경되었습니다');
    emit('close');
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    alert('서버 오류로 인해 비밀번호를 변경할 수 없습니다.');
  }
};
</script>
