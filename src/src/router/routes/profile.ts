import { type RouteRecordRaw } from "vue-router";

export const profileList: RouteRecordRaw = {
  name: "profile",
  path: "/profile",
  meta: {
    title: "Мой профиль",
    layout: "main",
    icon: "mdi-account-outline",
    breadcrumb: "Мой профиль",
  },
  component: () => import("@/pages/profile/index.vue"),
};

export const profileRoutes: RouteRecordRaw = {
  path: "/profile",
  children: [
    profileList,
  ],
};
