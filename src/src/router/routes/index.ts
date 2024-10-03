import { type RouteRecordRaw } from "vue-router";
import { usersRoutes } from "./users";
import { profileRoutes } from "./profile";
import { partnersRoutes } from "./partners";
import { logsRoutes } from "./logs";
import { companiesRoutes } from "./companies";
import { applicationRoutes } from "./application";

const MainRoute: RouteRecordRaw = {
  path: "/",
  name: "main",
  redirect: { name: "users" },
};

export const allRoutes: RouteRecordRaw[] = [
  MainRoute,
  usersRoutes,
  profileRoutes,
  partnersRoutes,
  logsRoutes,
  companiesRoutes,
  applicationRoutes,
];
