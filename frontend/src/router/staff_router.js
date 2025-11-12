// router/staff_router.js
import AppLayout from '@/layout/AppLayout.vue';
// 이 파일에서만 사용하는 컴포넌트가 있다면 여기서 import 합니다.
// 예: import About from '@/views/About.vue'

const staffRouter = [
  {
    path: '/staff',
    component: AppLayout,
    children: [
      {
        path: 'home',
        name: 'staffhome',
        component: () => import('@/views/pages/staff/StaffDashboard.vue'),
        // meta: { requiresAuth: false }, // 인증X
      },
    ],
  },
];

export default staffRouter;
