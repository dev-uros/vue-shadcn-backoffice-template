import type {RouteRecordRaw} from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UsersIndex',
    component: () => import('./pages/UsersPage.vue'),
    meta: {breadcrumb: 'Korisnici'}
  },

]
