import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/DashBoard.vue')
      },
      {
        path: 'license',
        component: () => import('pages/LicensePage.vue')
      },
      {
        path: 'user',
        component: () => import('pages/UserPage.vue'),
        children: [
          {
            path: 'info',
            component: () => import('components/User/UserInfo.vue')
          },
          {
            path: 'api-key',
            component: () => import('components/User/ApiKey/Index.vue')
          }
        ]
      },
    ],
  },
  {
    path: '/sign',
    component: () => import('src/pages/Sign.vue'),
    children: [
      {
        path: 'login',
        component: () => import('src/components/Sign/UserLogin.vue')
      },
      {
        path: 'signUp',
        component: () => import('src/components/Sign/UserSignUp.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
