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
.container {
  max-width: 600px; /* 원하는 최대 너비로 조정 (ex. 500px, 600px 등) */
  margin: 0 auto; /* 가로 가운데 정렬 */
  padding: 1rem; /* 좌우 여백 (선택) */
}
.title {
  margin: 1.5rem;
}
.card {
  margin: 1.5rem;
  padding: 1rem;
}
.profile-area {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  /* background: #ffffff; */
  /* flex-direction: column; */
}
</style>
