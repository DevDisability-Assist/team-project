import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  timeout: 10000,
});

// --- 요청 인터셉터 (Request Interceptor) ---
// (변경 없음)
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터 (Response Interceptor) ---
// (변경 없음 - authStore.refreshAccessToken()가 알아서 body로 전송)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  /* ... (내용 생략) ... */
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // 401 에러이고, 재시도한 요청이 아니며, 로그인 요청이 아닐 때만 토큰 갱신
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/login') {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshSuccess = await authStore.refreshAccessToken();

        if (refreshSuccess) {
          processQueue(null);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          const refreshError = new Error('Token refresh failed');
          processQueue(refreshError);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } catch (e) {
        processQueue(e);
        isRefreshing = false;
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

// API 서비스 객체
export const reservationApi = {
  /**
   * 나의 상담 내역을 조회합니다.
   * (GET /api/reservations/my)
   * @returns {Promise<AxiosResponse<any>>}
   */
  getMyReservations: () => {
    return api.get('/api/user/reservations/my');
  },

  /**
   * 특정 예약을 취소합니다.
   * (POST /api/reservations/cancel/:reservationId)
   * @param {number} reservationId - 취소할 예약 ID (res_no)
   * @returns {Promise<AxiosResponse<any>>}
   */
  cancelReservation: (reservationId) => {
    return api.post(`/api/user/reservations/cancel/${reservationId}`);
  },
};

export default api;
