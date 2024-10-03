<script setup lang="ts">
import { capitalize, computed } from "vue";
import { useRoute } from "vue-router";
import { VApp } from "vuetify/components";

const route = useRoute();
const layout = computed(() => capitalize(route.meta.layout ?? "default") + "Layout");
</script>

<template>
  <v-app :full-height="true">
    <component :is="layout">
      <RouterView />
    </component>
  </v-app>
</template>
