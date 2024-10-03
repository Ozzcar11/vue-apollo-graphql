import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRole } from "v-role";

import {
  removeUserCookie,
  setUserCookie,
} from "../utils/cookie";

import { type User } from "@/models/user";
import { ROLES } from "@/constants/roles";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const isAuthorized = computed(() => !!user.value);
  const role = computed(() => user.value?.role.name);

  const { setRoles } = useRole();

  const isSuperAdmin = computed(() => role.value === ROLES.SUPERADMIN);
  const isAdmin = computed(() => role.value === ROLES.ADMIN);

  function authUser(userData: User) {
    user.value = userData;
    setRoles([user.value.role.name]);
    setUserCookie(userData);
  }

  function reset() {
    user.value = null;
    setRoles([]);
    removeUserCookie();
  }

  return {
    user,
    role,
    isAuthorized,
    isSuperAdmin,
    isAdmin,
    authUser,
    reset,
  };
});
