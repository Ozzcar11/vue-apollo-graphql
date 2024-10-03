<script setup lang="ts">
import { VBtn, VIcon, VImg, VProgressCircular } from "vuetify/components";
import { type LoaderProps } from "@/types/loader";

type Props = {
  src: string;
  loader?: LoaderProps;
  closable?: boolean;
};

type Emits = {
  (e: "close"): void;
};

withDefaults(defineProps<Props>(), {
  loader: () => {
    return {
      size: 40,
      width: 5,
    };
  },
  clearable: false,
});
defineEmits<Emits>();
</script>

<template>
  <v-img
    v-bind="$attrs"
    :src="src"
    class="position-relative"
  >
    <template
      v-if="closable"
      #default
    >
      <v-btn
        type="button"
        variant="text"
        icon="mdi-close"
        class="close-button"
        @click="$emit('close')"
      />
    </template>
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          v-bind="loader"
          indeterminate
          color="primary"
        />
      </div>
    </template>
    <template #error>
      <VIcon
        icon="mdi-image-off-outline"
      />
    </template>
  </v-img>
</template>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;

  :deep(i) {
    position: relative;
    z-index: 1;
    color: #fff;
  }
}
</style>
