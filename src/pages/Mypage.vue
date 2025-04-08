<template>
  <div>
    <MypageLayout v-if="user">
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
          <div class="user-name">
            <template v-if="isEditing">
              <input type="text" v-model="editedNickname" />
            </template>
            <template v-else>
              {{ nickname }}
            </template>
          </div>
          <div class="user-email">{{ email }}</div>
          <div class="user-join-date">{{ joinDate }}</div>
        </div>
        <div class="btn-modi">
          <button
            class="btn btn-primary pointer"
            @click="isEditing ? saveNickname() : modiNickname()"
          >
            {{ isEditing ? '완료' : '수정' }}
          </button>
        </div>
      </template>

      <template v-slot:alarm-area>
        <div>알림 설정</div>
        <hr />
        <div
          class="switch-setting"
          v-for="(label, key) in alarmLabels"
          :key="key"
        >
          <label
            class="form-check-label justify-content-end pointer"
            :for="key"
          >
            {{ label }}
          </label>
          <span class="form-check form-switch">
            <input
              class="form-check-input pointer"
              type="checkbox"
              role="switch"
              :id="key"
              :checked="user[key]"
            />
          </span>
        </div>
      </template>

      <template v-slot:manage-area>
        계정 관리
        <div class="d-flex flex-column gap-2 mt-2">
          <button
            class="btn btn-passwordChange"
            @click="showPasswordChangeModal = true"
          >
            비밀번호 변경
          </button>
          <PasswordChangeModal
            v-if="showPasswordChangeModal"
            :userId="user.id"
            @close="showPasswordChangeModal = false"
          />
          <button class="btn btn-logout">로그아웃</button>
          <button class="btn btn-out">회원 탈퇴</button>
        </div>
      </template>
    </MypageLayout>
  </div>
</template>

<script setup>
import MypageLayout from '@/components/layouts/MypageLayout.vue';
import PasswordChangeModal from '@/components/modal/PasswordChangeModal.vue';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';

const BASEURL = 'http://localhost:3000/';
const user = ref(null);
const showPasswordChangeModal = ref(false);
const isEditing = ref(false);
const editedNickname = ref('');
const id = 1;

const alarmLabels = {
  pushAlarm: '푸시 알림',
  emailAlarm: '이메일 알림',
  payAlarm: '결제 예정 알림',
};

const modiNickname = () => {
  isEditing.value = true;
};

const saveNickname = async () => {
  try {
    const updatedUser = {
      ...user.value,
      nickname: editedNickname.value,
    };

    const response = await axios.put(
      `${BASEURL}users/${user.value.id}`,
      updatedUser
    );

    if (response.status === 200) {
      user.value.nickname = editedNickname.value;
      isEditing.value = false;
    } else {
      alert('닉네임 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('닉네임 수정 오류:', error);
    alert('서버 오류로 수정할 수 없습니다.');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`${BASEURL}users/${id}`);
    user.value = response.data;
    // editedNickname.value = user.value.nickname;
  } catch (err) {
    console.error('유저 정보 로드 실패:', err);
  }
});

// 옵셔널 체이닝을 이용해 null 방지
const email = computed(() => user.value?.email || '');
const nickname = computed(() => user.value?.nickname || '');
const joinDate = computed(() => user.value?.joinDate || '');
</script>

<style scoped>
.switch-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}
.btn-modi {
  margin-left: auto;
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
