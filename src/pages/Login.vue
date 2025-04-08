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

        <!-- 로그인 버튼 -->
        <button class="btn btn-primary w-100 mb-3" @click="login">
          로그인
        </button>

        <!-- 회원가입 링크 -->
        <p class="text-center text-muted small">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="text-primary">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const autoLogin = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = () => {
  console.log('이메일:', email.value);
  console.log('비밀번호:', password.value);
  console.log('자동 로그인:', autoLogin.value);
};
</script>
