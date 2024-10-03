<script setup lang="ts">
import { VBtn } from "vuetify/components";
import { type RouteLocationRaw } from "vue-router";

withDefaults(defineProps<{
  path?: RouteLocationRaw;
  color?: string;
}>(), {
  path: undefined,
  color: "primary",
});
defineEmits<{ (e: "click", value: Event): void }>();
</script>

<template>
  <v-btn
    class="base-button"
    :to="path"
    color="primary"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>
