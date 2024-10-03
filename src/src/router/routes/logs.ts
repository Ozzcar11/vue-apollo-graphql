import { type RouteRecordRaw } from "vue-router";

export const logsList: RouteRecordRaw = {
  name: "logs",
  path: "/logs",
  meta: {
    title: "Логирование",
    layout: "main",
    icon: "mdi-notification-clear-all",
    breadcrumb: "Логирование",
  },
  component: () => import("@/pages/logs-page/list.vue"),
};

export const logsRoutes: RouteRecordRaw = {
  path: "/logs",
  children: [
    logsList,
  ],
};
