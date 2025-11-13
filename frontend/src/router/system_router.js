import AppLayout from '@/layout/system/AppLayout.vue';

const systemRouter = [
  {
    path: '/system',
    component: AppLayout,
    children: [
      {
        path: '/system',
        name: 'sysDashboard',
        component: () => import('@/views/System_Dashboard.vue'),
      },
      {
        path: '/system/allow',
        name: 'sysAllow',
        component: () => import('@/views/uikit/system_ui/FormLayout.vue'),
      },
      {
        path: '/system/regist',
        name: 'input',
        component: () => import('@/views/uikit/system_ui/InputDoc.vue'),
      },
      {
        path: '/system/regist-list',
        name: 'button',
        component: () => import('@/views/uikit/system_ui/ButtonDoc.vue'),
      },
      {
        path: '/system/regist-plan',
        name: 'table',
        component: () => import('@/views/uikit/system_ui/TableDoc.vue'),
      },
      {
        path: '/system/plan-list',
        name: 'list',
        component: () => import('@/views/uikit/system_ui/ListDoc.vue'),
      },
      {
        path: '/system/survey',
        name: 'SurveyList',
        component: () => import('@/views/uikit/system_ui/SurveyTable.vue'),
      },
      {
        path: '/system/survey/detail/:id',
        name: 'SurveyDetail',
        // 이 라우트가 로드할 실제 상세 페이지 컴포넌트
        component: () => import('@/views/uikit/system_ui/TimelineDoc.vue'),
      },
      {
        path: '/system/regist-survey', // (실제 경로는 다를 수 있습니다)
        name: 'RegistSurvey', // 👈 이 'name'을 사용할 것입니다.
        component: () => import('@/views/uikit/system_ui/RegistSurvey.vue'),
      },
    ],
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

  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue'),
  },
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
];

export default systemRouter;
