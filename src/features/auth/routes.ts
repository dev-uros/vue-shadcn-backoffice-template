import type {RouteRecordRaw} from "vue-router";

export const authRoutes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/',
    component: () => import('./pages/LoginPage.vue'),
  }
]
