import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";

import { authRoutes } from "./auth";
import { allRoutes } from "./routes";
import { authMiddleware, roleMiddleware } from "@/modules/auth/utils/middleware";

export const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...allRoutes,
  {
    path: "/404",
    name: "404",
    meta: {
      title: "Страница не найдена",
      includeInMenu: false,
      layout: "default",
    },
    component: () => import("@/pages/404.vue"),
  },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);
router.beforeEach(roleMiddleware);

export { router };
