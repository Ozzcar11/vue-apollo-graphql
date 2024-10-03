import { type RouteRecordRaw } from "vue-router";

export const companiesList: RouteRecordRaw = {
  name: "companies",
  path: "/companies",
  meta: {
    title: "Компании",
    layout: "main",
    icon: "mdi-toolbox-outline",
  },
  component: () => import("@/pages/companies/list.vue"),
};

export const companiesRoutes: RouteRecordRaw = {
  path: "/companies",
  children: [
    companiesList,
  ],
};
