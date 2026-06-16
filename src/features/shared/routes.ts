import type {RouteRecordRaw} from "vue-router";

export const sharedRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./pages/NotFoundPage.vue'),
  },

]
