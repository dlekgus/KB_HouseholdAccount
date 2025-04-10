<template>
  <nav class="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2">
    <!-- 로고 -->
    <router-link to="/home" class="navbar-brand fw-bold me-4"
      >KB가계부</router-link
    >

    <!-- 토글 버튼 -->
    <button
      class="navbar-toggler"
      type="button"
      @click="isNavShow = !isNavShow"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- 네비게이션 -->
    <div
      :class="[
        'collapse navbar-collapse justify-content-end',
        { show: isNavShow },
      ]"
    >
      <ul class="navbar-nav align-items-center gap-3">
        <li class="nav-item" v-for="item in navItems" :key="item.path">
          <router-link
            class="nav-link nav-link-colored"
            :to="item.path"
            :class="{ active: route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
        </li>
        <li class="nav-item">
          <img
            :src="userImage"
            alt="프로필"
            class="profile-image"
            @click="goToMypage"
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isNavShow = ref(false);

const userImage = ref("");
onMounted(() => {
  userImage.value =
    localStorage.getItem("userImage") || "https://via.placeholder.com/36";
});

const goToMypage = () => {
  router.push("/mypage");
};

const navItems = [
  { label: "홈", path: "/home" },
  { label: "내역", path: "/details" },
  { label: "고정지출", path: "/fixedExpenses" },
  { label: "통계", path: "/analysis" },
  { label: "마이페이지", path: "/mypage" },
];
</script>

<style scoped>
.navbar-brand {
  font-size: 1.25rem;
  color: #4318d1;
}

.nav-link-colored {
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  background-color: #e7defc; /* 기본 배경색 (연보라) */
  color: #4318d1; /* 기본 글자색 */
}

.nav-link-colored.active {
  background-color: #4318d1; /* 현재 라우트일 때 배경색 */
  color: white;
}

.profile-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  box-shadow: 0 0 0 2px #e0e0e0;
}
.profile-image:hover {
  box-shadow: 0 0 0 2px #4318d1;
}
</style>
