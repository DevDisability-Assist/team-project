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
        component: () => import('@/views/pages/staff/StaffDashboard.vue'), // meta: { requiresAuth: false }, // 인증X
      },
      {
        path: '/survey/:surveyNo',
        name: 'survey',
        component: () => import('@/views/uikit/Survey.vue'),
        props: true,
      },
      {
        path: '/activityreport',
        name: 'activityreport',
        component: () => import('@/views/uikit/ActivityReport.vue'),
      },
      {
        path: '/applicationlist',
        name: 'applicationlist',
        component: () => import('@/views/uikit/ApplicationList.vue'),
      },
      {
        path: '/applicationform',
        name: 'applicationform',
        component: () => import('@/views/uikit/ApplicationForm.vue'),
      },
      {
        path: '/staffschedule-settings',
        name: 'staffschedule-settings',
        component: () => import('@/views/pages/staff/StaffScheduleSettings.vue'),
      },
      {
        path: '/reservations',
        name: 'reservations',
        component: () => import('@/views/pages/staff/Reservations.vue'),
      },
    ],
  },
];

export default staffRouter;
