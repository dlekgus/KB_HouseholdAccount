<template>
  <div>
    <MypageLayout>
      <template v-slot:title-area>
        <h2>마이페이지</h2>
        <p>회원 정보 및 설정을 관리하세요</p>
      </template>
      <template v-slot:profile-area>
        <div class="user-image">
          <img
            src="https://velog.velcdn.com/images/chanmi125/post/18a3256c-dbaf-4f5e-952e-c694496e25ad/image.svg"
            alt=""
          />
        </div>
        <div class="info">
          <div class="user-name">{{ nickname }}</div>
          <div class="user-email">{{ email }}</div>
          <div class="user-join-date">{{ joinDate }}</div>
        </div>
      </template>

      <template v-slot:alarm-area>
        <div>알림 설정</div>
        <hr />
        <div class="switch-setting">
          <label
            class="form-check-label justify-content-end pointer"
            for="pushAlarm"
          >
            푸시 알림</label
          >
          <span class="form-check form-switch">
            <input
              class="form-check-input pointer"
              type="checkbox"
              role="switch"
              id="pushAlarm"
              :checked="pushAlarm"
            />
          </span>
        </div>
        <div class="switch-setting">
          <label
            class="form-check-label justify-content-end pointer"
            for="emailAlarm"
          >
            이메일 알림</label
          >
          <span class="form-check form-switch">
            <input
              class="form-check-input pointer"
              type="checkbox"
              role="switch"
              id="emailAlarm"
              :checked="emailAlarm"
            />
          </span>
        </div>
        <div class="switch-setting">
          <label
            class="form-check-label justify-content-end pointer"
            for="payAlarm"
          >
            결제 예정 알림</label
          >
          <span class="form-check form-switch">
            <input
              class="form-check-input pointer"
              type="checkbox"
              role="switch"
              id="payAlarm"
              :checked="payAlarm"
            />
          </span>
        </div>
      </template>
      <template v-slot:manage-area
        >계정 관리
        <div class="d-flex flex-column gap-2 mt-2">
          <button class="btn btn-passwordChange">비밀번호 변경</button>
          <button class="btn btn-logout">로그아웃</button>
          <button class="btn btn-out">회원 탈퇴</button>
        </div>
      </template>
    </MypageLayout>
  </div>
</template>

<script setup>
import MypageLayout from '@/components/layouts/MypageLayout.vue';
import { computed, ref } from 'vue';

const users = [
  {
    id: 1, //로그인할 때 전역으로 둬야함
    email: 'test@example.com',
    password: '1234',
    nickname: '김케이비',
    joinDate: 'date',
    pushAlarm: false,
    emailAlarm: true,
    payAlarm: true,
  },
];

const user = ref(users[0]);
const email = computed(() => user.value.email);
const nickname = computed(() => user.value.nickname);
const joinDate = computed(() => user.value.joinDate);
const pushAlarm = computed(() => user.value.pushAlarm);
const emailAlarm = computed(() => user.value.emailAlarm);
const payAlarm = computed(() => user.value.payAlarm);
</script>

<style scoped>
.switch-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.user-image {
  background-color: rgb(212, 212, 212);
  border-radius: 50px;
  height: 70px;
  width: 70px;
  margin-right: 0.75rem;
}
.user-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-size: small;
  margin-bottom: 0.1rem;
}
.user-email {
  font-size: 8px;
  margin-bottom: 0.1rem;
}
.user-join-date {
  font-size: 8px;
  margin-bottom: 0.1rem;
}
.btn {
  text-align: left;
  font-size: small;
  cursor: pointer;
}
.btn-logout {
  background-color: #fef2f2;
  color: red;
  border: 0;
}
.btn-passwordChange {
  background-color: #f3f4f6;
}
.btn-out {
  color: #6b7280;
  font-size: x-small;
}
.pointer {
  cursor: pointer;
}
</style>
