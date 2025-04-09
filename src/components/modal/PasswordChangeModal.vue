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
import axios from 'axios';
const emit = defineEmits(['close']);
const BASEURL = 'http://localhost:3000/';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const props = defineProps({
  userId: Number,
});

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호가 일치하지 않습니다.');
    return;
  }

  if (newPassword.value.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다.');
    return;
  }

  try {
    // 현재 유저 정보 가져오기
    const response = await axios.get(
      `http://localhost:3000/users/${props.userId}`
    );
    const user = response.data;

    if (user.password !== currentPassword.value) {
      alert('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 업데이트
    const updatedUser = {
      ...user,
      password: newPassword.value,
    };

    const updateResponse = await axios.put(
      `${BASEURL}users/${props.userId}`,
      updatedUser
    );

    if (updateResponse.status === 200) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      emit('close');
    } else {
      alert('비밀번호 변경에 실패했습니다.');
    }
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    alert('서버 오류로 인해 비밀번호를 변경할 수 없습니다.');
  }
};
</script>
