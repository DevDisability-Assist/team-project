import { defineStore } from 'pinia';
import api from '@/api/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null, // [추가] Refresh Token도 LocalStorage에 저장
    isLoading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
    userRole: (state) => state.user?.role || 'GUEST',
  },
  actions: {
    async login(credentials) {
      this.isLoading = true;
      try {
        const response = await api.post('/api/auth/login', credentials);
        // [수정] 백엔드에서 모든 토큰을 JSON으로 반환받음
        const { accessToken, refreshToken, user } = response.data;

        this.accessToken = accessToken;
        this.refreshToken = refreshToken; // [추가] Refresh Token 저장
        this.user = user;

        router.push('/');
        // [추가] 성공 시 true 반환 (컴포넌트에서 알 수 있도록)
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        this.$reset();
        // [추가] 실패 시 에러 객체/메시지 throw (컴포넌트에서 알 수 있도록)
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // this.$reset()이 Pinia state와 localStorage를 모두 초기화합니다.

    async logout() {
      console.log('[AuthStore] Logout action called. Clearing state and localStorage.');

      // 1. (선택) 서버에 로그아웃 통보 (필요시)
      // 이 아키텍처에서는 필수 아님.
      // api.post('/auth/notify-logout').catch(err => console.error(err));

      // 2. Pinia state와 localStorage 초기화
      this.$reset();

      // 3. 로그인 페이지로 리디렉션
      router.push({ name: 'login' });
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        console.warn('[AuthStore] No refresh token available for refresh.');
        this.logout();
        return false;
      }
      try {
        // [수정] Refresh Token을 body에 담아 전송
        const response = await api.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        });
        this.accessToken = response.data.accessToken;
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout(); // 리프레시 실패 시 강제 로그아웃
        return false;
      }
    },

    async fetchUser() {
      if (!this.accessToken) return;
      this.isLoading = true;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.user;
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  persist: true, // 모든 state를 localStorage에 저장
});
