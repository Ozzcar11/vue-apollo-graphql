import { type BaseSidebarMeta } from "@ozzcar11/components";
import { type RouteRecordNormalizedLoaded } from "vue-router";
import { type Breadcrumb } from "./types/breadcrumbs";
export {}

declare module 'vue-router' {
  interface RouteMeta extends BaseSidebarMeta {
    title?: string;
    layout?: string;
    requireAuth?: boolean;
    breadcrumb?:  string | false | ((route: RouteRecordNormalizedLoaded) => Breadcrumb)
    roles?: string[]
  }
}
