<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { BaseSidebar } from "@ozzcar11/components";
import { useAuthStore } from "@/modules/auth/stores/auth";
import { SidebarRoutes } from "@/router/sidebar";
import { useLogout } from "@/modules/auth/composables/useLogout";
import { useSidebarStore } from "@/stores/sidebar";

const router = useRouter();
const authStore = useAuthStore();
const sidebar = useSidebarStore();

const { logoutRequest, onError } = useLogout();

const logo = {
  src: "/images/logo.svg",
  mobile: "/images/logo-mobile.svg",
  width: 193,
  height: 40,
};

const routesByRole = computed(() => SidebarRoutes[authStore.role as keyof typeof SidebarRoutes] ?? []);

const userFullName = computed(() => {
  const userProfile = authStore.user?.profile;

  if (!userProfile) return "";

  const { firstname, lastname, middlename } = userProfile;

  return `${lastname} ${firstname} ${middlename ?? ""}`;
});

async function logout() {
  await logoutRequest();
  reset();
}

function reset() {
  authStore.reset();
  void router.push({ name: "login" });
}

onError(reset);
</script>

<template>
  <BaseSidebar
    v-model="sidebar.visible"
    class="bg-grey-lighten-4"
    :logo="logo"
    :routes="routesByRole"
    :title="userFullName"
    :subtitle="authStore.user?.role.title"
    :drawer="{ width: 340 }"
    @logout="logout"
  />
</template>
