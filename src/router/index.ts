import { createRouter, createWebHistory } from 'vue-router'
import {homeRoutes} from "@/features/home/routes.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes
  ],
})

export default router
