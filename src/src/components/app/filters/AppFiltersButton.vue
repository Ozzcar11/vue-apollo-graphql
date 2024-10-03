<script setup lang="ts">
import { VBtn } from "vuetify/components";

type Emits = {
  (e: "click"): void;
};

defineEmits<Emits>();
</script>

<template>
  <v-btn
    color="gray-light"
    prepend-icon="mdi-filter-variant"
    @click="$emit('click')"
  >
    Фильтры
  </v-btn>
</template>
