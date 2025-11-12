// router/index.js

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
    path: '/home',
    name: 'userhome',
    component: () => import('@/components/AppMain.vue'),
  },
  {
    path: '/syshome',
    name: 'syshome',
    component: () => import('@/components/SysMain.vue'),
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
];

export default routes;
