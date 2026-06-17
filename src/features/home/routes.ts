import type {RouteRecordRaw} from "vue-router";

export const homeRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('./pages/HomePage.vue'),
    meta: {breadcrumb: [{label: 'Početna', path: '/'}]}
  }
]
