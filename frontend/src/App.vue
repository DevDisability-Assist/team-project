<script setup>
import { onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  console.log('[App.vue] onMounted: 앱이 마운트되었습니다.');
  console.log('[App.vue] onMounted: 초기 로그인 상태:', authStore.isLoggedIn);
  console.log('[App.vue] onMounted: 초기 사용자 정보:', authStore.user);

  // 앱 마운트 시, accessToken(localStorage)은 있는데 user(state) 정보가 없으면
  if (authStore.accessToken && !authStore.user) {
    console.log('[App.vue] onMounted: 세션 복원을 시도합니다 (fetchUser).');
    // 서버에서 사용자 정보를 가져와 state를 복원합니다.
    authStore.fetchUser();
  }
});

// authStore의 isLoggedIn 게터 상태를 감시합니다.
watch(
  () => authStore.isLoggedIn,
  (newIsLoggedIn, oldIsLoggedIn) => {
    console.log(`[App.vue] watch: 로그인 상태 변경: ${oldIsLoggedIn} -> ${newIsLoggedIn}`);
    if (newIsLoggedIn) {
      console.log('[App.vue] watch: 현재 로그인된 사용자:', authStore.user);
    } else {
      console.log('[App.vue] watch: 사용자가 로그아웃되었습니다.');
    }
  }
);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
