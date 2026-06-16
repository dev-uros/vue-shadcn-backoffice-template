import { createRouter, createWebHistory } from 'vue-router'
import {homeRoutes} from "@/features/home/routes.ts";
import {sharedRoutes} from "@/features/shared/routes.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes,

    ...sharedRoutes,
  ],
})

export default router
