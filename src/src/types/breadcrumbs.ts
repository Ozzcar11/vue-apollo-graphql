import { type RouteLocationNormalized, type RouteRecordRaw } from "vue-router";

export type Breadcrumb = {
  title: string;
  to: Partial<RouteLocationNormalized>;
};

export type FlattenedRoute = {
  name: RouteRecordRaw["name"];
  path: RouteRecordRaw["path"];
  meta?: RouteRecordRaw["meta"];
  parent?: number;
};
