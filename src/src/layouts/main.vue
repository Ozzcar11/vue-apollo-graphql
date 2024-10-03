<script setup lang="ts">
import { VMain } from "vuetify/components";
import { BaseNotifications } from "@ozzcar11/components";
import { useNotifications } from "@ozzcar11/utilities/composables";
import AppSidebar from "@/components/app/AppSidebar.vue";
import AppBreadcrumbs from "@/components/app/AppBreadcrumbs.vue";

defineOptions({
  name: "MainLayout",
});

const { notifications, unnotificate } = useNotifications();
</script>

<template>
  <AppSidebar />
  <v-main class="d-flex flex-column">
    <AppBreadcrumbs />
    <slot />
    <BaseNotifications
      :notifications="notifications"
      @unnotificate="unnotificate"
    />
  </v-main>
</template>
