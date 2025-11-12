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
];
