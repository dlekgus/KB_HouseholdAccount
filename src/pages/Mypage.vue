<template>
  <div>
    <MypageLayout>
      <template v-slot:title-area>
        <h2>안녕하세요</h2>
      </template>
      <template v-slot:profile-area>
        <div class="user-image">
          <img
            src="https://velog.velcdn.com/images/chanmi125/post/18a3256c-dbaf-4f5e-952e-c694496e25ad/image.svg"
            alt=""
          />
        </div>
        <div class="info">
          <div class="user-name">이름</div>
          <div class="user-email">이메일</div>
          <div class="user-join-date">가입일</div>
        </div>
      </template>

      <template v-slot:alarm-area>알림</template>
      <template v-slot:manage-area>계정 관리</template>
    </MypageLayout>
  </div>
</template>

<script setup>
import MypageLayout from '@/components/layouts/MypageLayout.vue';
</script>

<style scoped>
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
}
.user-name {
  font-size: small;
}
.user-email {
  font-size: 8px;
}
.user-join-date {
  font-size: 8px;
}
</style>
