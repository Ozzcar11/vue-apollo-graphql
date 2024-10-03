import { type RouteRecordRaw } from "vue-router";
import { ROLES } from "@/constants/roles";

export const applicationList: RouteRecordRaw = {
  name: "application",
  path: "/application",
  meta: {
    title: "Анкетирование",
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
  },
  component: () => import("@/pages/application/list.vue"),
};

export const applicationAbout: RouteRecordRaw = {
  name: "application.about",
  path: "/application/:id/about-:type?",
  meta: {
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
    includeInMenu: false,
  },
  component: () => import("@/pages/application/about.vue"),
};

export const applicationEcology: RouteRecordRaw = {
  name: "application.ecology",
  path: "/application/:id/ecology-:type?",
  meta: {
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
    includeInMenu: false,
  },
  component: () => import("@/pages/application/ecology.vue"),
};

export const applicationPersonnel: RouteRecordRaw = {
  name: "application.personnel",
  path: "/application/:id/personnel-:type?",
  meta: {
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
    includeInMenu: false,
  },
  component: () => import("@/pages/application/personnel.vue"),
};

export const applicationGoverment: RouteRecordRaw = {
  name: "application.goverment",
  path: "/application/:id/goverment-:type?",
  meta: {
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
    includeInMenu: false,
  },
  component: () => import("@/pages/application/goverment.vue"),
};

export const applicationBusiness: RouteRecordRaw = {
  name: "application.business",
  path: "/application/:id/business-:type?",
  meta: {
    layout: "main",
    icon: "mdi-book-outline",
    roles: Object.values(ROLES),
    includeInMenu: false,
  },
  component: () => import("@/pages/application/business.vue"),
};

export const applicationRoutes: RouteRecordRaw = {
  path: "/application",
  children: [
    applicationList,
    applicationAbout,
    applicationEcology,
    applicationPersonnel,
    applicationGoverment,
    applicationBusiness,
  ],
};
