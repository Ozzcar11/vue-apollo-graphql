<script setup lang="ts">
import { VMain } from "vuetify/components";
import { BaseNotifications } from "@ozzcar11/components";
import { useNotifications } from "@ozzcar11/utilities/composables";

defineOptions({
  name: "DefaultLayout",
});

const { notifications, unnotificate } = useNotifications();
</script>

<template>
  <v-main class="main-container">
    <slot />
    <BaseNotifications
      :notifications="notifications"
      @unnotificate="unnotificate"
    />
  </v-main>
</template>

<style lang="scss" scoped>
.main-container {
  background-color: rgb(var(--v-theme-gray-light));
}
</style>
