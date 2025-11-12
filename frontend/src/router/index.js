// router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// 1. 분리된 모든 경로 파일(지도 조각)들을 import 합니다.
import systemRouter from './system_router.js';
import mainRouter from './main_router.js';
import defaultRouter from './default_router.js';
import staffRouter from './staff_router.js';

const routes = [
  {
    path: '/uikit/overlay',
    name: 'overlay',
    component: () => import('@/views/uikit/OverlayDoc.vue'),
  },
  {
    path: '/uikit/media',
    name: 'media',
    component: () => import('@/views/uikit/MediaDoc.vue'),
  },
  {
    path: '/uikit/message',
    name: 'message',
    component: () => import('@/views/uikit/MessagesDoc.vue'),
  },
  {
    path: '/uikit/file',
    name: 'file',
    component: () => import('@/views/uikit/FileDoc.vue'),
  },
  {
    path: '/uikit/menu',
    name: 'menu',
    component: () => import('@/views/uikit/MenuDoc.vue'),
  },
  {
    path: '/uikit/charts',
    name: 'charts',
    component: () => import('@/views/uikit/ChartDoc.vue'),
  },
  {
    path: '/uikit/misc',
    name: 'misc',
    component: () => import('@/views/uikit/MiscDoc.vue'),
  },
  {
    path: '/uikit/timeline',
    name: 'timeline',
    component: () => import('@/views/uikit/TimelineDoc.vue'),
  },
  {
    path: '/blocks',
    name: 'blocks',
    meta: {
      breadcrumb: ['Prime Blocks', 'Free Blocks'],
    },
    component: () => import('@/views/utilities/Blocks.vue'),
  },
  {
    path: '/pages/empty',
    name: 'empty',
    component: () => import('@/views/pages/Empty.vue'),
  },
  {
    path: '/pages/crud',
    name: 'crud',
    component: () => import('@/views/pages/Crud.vue'),
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: () => import('@/views/pages/Documentation.vue'),
  },

  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/views/pages/Landing.vue'),
  },
  {
    path: '/pages/notfound',
    name: 'notfound',
    component: () => import('@/views/pages/NotFound.vue'),
  },
  // {
  //   path: '/auth/login',
  //   name: 'login',
  //   component: () => import('@/views/pages/auth/Login.vue'),
  // },
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/pages/auth/Access.vue'),
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/pages/auth/Error.vue'),
  },

  // 2. Spread 연산자(...)를 사용해 두 배열을 하나의 'routes' 배열로 합칩니다.
  ...systemRouter,
  ...mainRouter,
  ...defaultRouter,
  ...staffRouter,
  // 나중에 경로 파일을 더 만들어도 여기에 계속 추가하면 됩니다.
  // ...adminRoutes,
  // ...userRoutes,
];

// 3. 합쳐진 'routes'를 사용해 *하나의* 라우터 인스턴스를 생성합니다.
const router = createRouter({
  history: createWebHistory(),
  routes: routes, // 합쳐진 경로 배열을 사용
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = authStore.accessToken; // 토큰 존재 여부
  const userRole = authStore.userRole;

  // 1. 인증이 필요한 페이지
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 1a. 인증 안됨 -> 로그인 페이지로
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }
    // 1b. 역할(Role) 체크
    if (to.meta.role && to.meta.role !== userRole) {
      return next({ name: 'accessDenied' }); // 권한 없음
    }
    return next();
  }

  // 2. 인증이 필요 없는 페이지 (e.g., 로그인)
  if (to.meta.requiresAuth === false) {
    if (isAuthenticated) {
      // 2a. 이미 로그인한 사용자가 로그인 페이지 접근 시 -> 홈으로
      return next({ name: 'dashboard' });
    }
    return next();
  }

  // 3. meta 설정이 없는 경우 (기본)
  return next();
});

// 4. 이 통합 라우터를 export 합니다.
export default router;
