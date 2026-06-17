import { createRouter, createWebHistory } from 'vue-router'
import {homeRoutes} from "@/features/home/routes.ts";
import {sharedRoutes} from "@/features/shared/routes.ts";
import {userRoutes} from "@/features/users/routes.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        ...homeRoutes,
        ...sharedRoutes,
        ...userRoutes
      ]
    }
  ],
})

export default router
