import { type RouteRecordRaw } from "vue-router";
import { type FlattenedRoute } from "@/types/breadcrumbs";

export function flatRoutes(routes: RouteRecordRaw[], parent?: number): FlattenedRoute[] {
  let flattenedRoutes: FlattenedRoute[] = [];

  for (const route of routes) {
    if (!route.name) continue;

    flattenedRoutes.push({ name: route.name, path: route.path, meta: route.meta, parent: (parent ?? 0) - 1 });
    if (route.children && route.children.length > 0) {
      const children = flatRoutes(route.children, flattenedRoutes.length + (parent ?? 0));
      flattenedRoutes = flattenedRoutes.concat(children);
    }
  }

  return flattenedRoutes;
}
