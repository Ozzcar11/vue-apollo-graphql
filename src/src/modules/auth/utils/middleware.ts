import { type RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { getUserSession } from "./session";
import { loginRoute } from "@/router/auth";

export const authMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore();

  if (to.name === loginRoute.name && to.query.p === "logout") {
    authStore.reset();

    return redirectToLogin(from);
  }

  if (to.meta.requireAuth !== false) {
    if (authStore.isAuthorized) return true;

    const userData = await getUserSession();
    if (userData === false) return redirectToLogin(from);

    authStore.authUser(userData);
  }

  return true;
};

export const roleMiddleware = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore();

  if (to.meta.roles == null) return true;
  if (authStore.role == null) return false;

  const hasAccess = to.meta.roles?.includes(authStore.role);
  if (hasAccess) return true;

  return from;
};

function redirectToLogin(from: RouteLocationNormalized) {
  if (from.name === loginRoute.name) return false;

  return { name: loginRoute.name };
}
