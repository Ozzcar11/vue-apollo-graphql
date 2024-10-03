import { type RouteRecordRaw } from "vue-router";
import { ROLES } from "@/constants/roles";

export const usersList: RouteRecordRaw = {
  name: "users",
  path: "/users",
  meta: {
    title: "Пользователи",
    layout: "main",
    icon: "mdi-account-group-outline",
    roles: [ROLES.WATCHER, ROLES.SUPERADMIN, ROLES.ADMIN],
  },
  component: () => import("@/pages/users/list.vue"),
};

export const usersCreate: RouteRecordRaw = {
  name: "users.create",
  path: "/users/create",
  meta: {
    layout: "main",
    includeInMenu: false,
    roles: [ROLES.SUPERADMIN],
  },
  component: () => import("@/pages/users/create.vue"),
};

export const usersUpdate: RouteRecordRaw = {
  name: "users.update",
  path: "/users/:id",
  meta: {
    layout: "main",
    includeInMenu: false,
    roles: [ROLES.WATCHER, ROLES.SUPERADMIN],
  },
  component: () => import("@/pages/users/update.vue"),
};

export const usersShow: RouteRecordRaw = {
  name: "users.show",
  path: "/users/show/:id",
  meta: {
    layout: "main",
    includeInMenu: false,
  },
  component: () => import("@/pages/users/show.vue"),
};

export const usersRoutes: RouteRecordRaw = {
  path: "/users",
  children: [
    usersList,
    usersCreate,
    usersUpdate,
    usersShow,
  ],
};
