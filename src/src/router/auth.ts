import { type RouteRecordRaw } from "vue-router";

export const loginRoute: RouteRecordRaw = {
  path: "/login",
  name: "login",
  meta: {
    title: "Авторизация",
    includeInMenu: false,
    requireAuth: false,
  },
  component: () => import("@/pages/auth/index.vue"),
};

export const authRoutes: RouteRecordRaw[] = [
  loginRoute,
];
