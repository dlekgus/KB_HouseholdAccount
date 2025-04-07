<template>
  <div class="container">
    <div class="title">
      <slot name="title-area">마이페이지</slot>
    </div>

    <div class="card profile-area">
      <slot name="profile-area"
        >이미지 프로필 사진/ 닉네임/ 이메일 주소/ 가입 날짜</slot
      >
    </div>

    <div class="card"><slot name="alarm-area">알림 설정</slot></div>

    <div class="card">
      <slot name="manage-area"
        >계정 관리 - 비밀번호 변경, 로그아웃, 회원 탈퇴</slot
      >
    </div>
  </div>
</template>

<style scoped>
.title {
}
.card {
  margin: 1.5rem;
  /* align-items: center; */
}
.profile-area {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  /* background: #ffffff; */
  /* flex-direction: column; */
}
</style>
