import { type RouteRecordRaw } from "vue-router";
import { ROLES } from "@/constants/roles";

export const partnersList: RouteRecordRaw = {
  name: "partners",
  path: "/partners",
  meta: {
    title: "Предложения от партнеров",
    layout: "main",
    icon: "mdi-handshake-outline",
    roles: [ROLES.WATCHER, ROLES.SUPERADMIN],
  },
  component: () => import("@/pages/partners/list.vue"),
};

export const partnersCreate: RouteRecordRaw = {
  name: "partners.create",
  path: "/partners/create",
  meta: {
    layout: "main",
    includeInMenu: false,
    roles: [ROLES.SUPERADMIN],
  },
  component: () => import("@/pages/partners/create.vue"),
};

export const partnersUpdate: RouteRecordRaw = {
  name: "partners.update",
  path: "/partners/:id",
  meta: {
    layout: "main",
    includeInMenu: false,
    roles: [ROLES.WATCHER, ROLES.SUPERADMIN],
  },
  component: () => import("@/pages/partners/update.vue"),
};

export const partnersRoutes: RouteRecordRaw = {
  path: "/partners",
  children: [
    partnersList,
    partnersCreate,
    partnersUpdate,
  ],
};
