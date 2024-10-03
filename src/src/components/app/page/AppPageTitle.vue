<script setup lang="ts">
import { VCol, VRow } from "vuetify/components";

type Props = { title?: string; showDivider?: boolean };

withDefaults(defineProps<Props>(), {
  title: "",
  showDivider: false,
});
</script>

<template>
  <header>
    <h1
      v-if="title"
      class="text-h5 font-weight-regular mb-4 mb-md-8"
    >
      {{ title }}
    </h1>
    <VRow
      v-if="$slots.search || $slots.buttons"
      justify="space-between"
      align="end"
    >
      <VCol
        cols="12"
        md="6"
        lg="3"
      >
        <slot name="search" />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="app-page-title__buttons d-flex buttons-gap justify-end"
      >
        <slot name="buttons" />
      </VCol>
    </VRow>
    <hr
      v-if="showDivider"
      class="divider"
    >
    <div class="mt-4">
      <slot name="tabs" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.divider {
  display: block;
  width: 100%;
  height: 2px;
  margin: 32px 0;
  border: 0;
  background-color: #0000001F;
}

.app-page-title__buttons {
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
}
</style>
