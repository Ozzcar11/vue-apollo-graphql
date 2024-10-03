<script setup lang="ts">
import { computed } from "vue";
import { VBreadcrumbs } from "vuetify/components";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

const breadcrumbs = computed(() => useBreadcrumbsStore().breadcrumbs);
</script>

<template>
  <v-breadcrumbs
    v-if="breadcrumbs.length > 0"
    :items="breadcrumbs"
    divider="/"
    class="app-breadcrumbs container text-caption py-4 pt-md-8"
  />
</template>

<style lang="scss">
.app-breadcrumbs {
  line-height: 1.25rem;
  overflow: auto hidden;

  .v-breadcrumbs-item {
    white-space: nowrap;

    &:first-child {
      padding-left: 0;
    }
  }
}
</style>
