import type {RouteRecordRaw} from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UsersIndex',
    component: () => import('./pages/UsersPage.vue'),
    meta: { breadcrumb: [{ label: 'Korisnici' }] }
  },
  {
    path: '/users/create',
    name: 'UsersCreate',
    component: () => import('./pages/UserCreatePage.vue'),
    meta: {
      breadcrumb: [
        { label: 'Korisnici', path: '/users' },
        { label: 'Kreiranje' },
      ]
    }
  },
]
