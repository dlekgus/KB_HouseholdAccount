<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center bg-light-purple text-center"
  >
    <div>
      <img
        src="@/assets/images/404.png"
        alt="404 이미지"
        class="img-fluid mb-3 notfound-image"
      />
      <p class="fs-5">페이지를 찾을 수 없어요</p>
      <router-link to="/home" class="btn btn-primary mt-3">
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.bg-light-purple {
  background-color: #f3ecff;
  color: #7c3aed;
}
.btn-primary {
  background-color: #7c3aed;
  border: none;
}
.btn-primary:hover {
  background-color: #6d28d9;
}
.notfound-image {
  max-width: 300px;
  height: auto;
}
</style>
