<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center"
    style="background-color: #f8f9fa"
  >
    <div class="container d-flex justify-content-center">
      <div
        class="card shadow p-4"
        style="width: 100%; max-width: 400px; border-radius: 1rem"
      >
        <div class="text-center mb-4">
          <h2 class="fw-bold">KB가계부</h2>
          <p class="text-muted">나의 소비를 똑똑하게 관리하세요</p>
        </div>

        <!-- 이메일 -->
        <div class="mb-3">
          <label class="form-label">이메일</label>
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              v-model="email"
              placeholder="이메일을 입력하세요"
            />
            <span class="input-group-text">
              <i class="fa-solid fa-envelope"></i>
            </span>
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label">비밀번호</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
            />
            <span
              class="input-group-text"
              style="cursor: pointer"
              @click="togglePassword"
            >
              <i
                :class="
                  showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
                "
              ></i>
            </span>
          </div>
          <div class="text-end mt-1">
            <a href="#" class="small text-primary">비밀번호 찾기</a>
          </div>
        </div>

        <!-- 자동 로그인 -->
        <div class="form-check mb-4">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="autoLogin"
            id="autoLogin"
          />
          <label class="form-check-label" for="autoLogin"> 자동 로그인 </label>
        </div>
        <!-- 오류 메시지 출력 -->
        <div v-if="errorMessage" class="text-danger small text-center mb-3">
          {{ errorMessage }}
        </div>

        <!-- 로그인 버튼 -->
        <button class="btn btn-primary w-100 mb-3" @click="login">
          로그인
        </button>

        <!-- 회원가입 링크 -->
        <p class="text-center text-muted small">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="text-p">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const autoLogin = ref(false);
const errorMessage = ref('');

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    const res = await axios.get('/api/users', {
      params: {
        email: email.value,
        password: password.value,
      },
    });

    if (res.data.length > 0) {
      // 로그인 성공
      console.log('✅ 로그인 성공:', res.data[0]);
      errorMessage.value = '';
      router.push('/home');
    } else {
      // 로그인 실패
      errorMessage.value = '이메일 또는 비밀번호가 일치하지 않습니다.';
    }
  } catch (err) {
    console.error('로그인 오류:', err);
    errorMessage.value = '로그인 중 오류가 발생했습니다.';
  }
};
</script>
