export default [
  {
    path: '/ud',
    name: 'ud',
    component: () => import('@/views/UserDashboard.vue'),
  },
  {
    path: '/uds',
    name: 'uds',
    component: () => import('@/components/UserSearch.vue'),
  },
  {
    path: '/un',
    name: 'un',
    component: () => import('@/components/UserNotice.vue'),
  },
  {
    path: '/sn',
    name: 'sn',
    component: () => import('@/components/StaffNotice.vue'),
  },
];
