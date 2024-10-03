<script lang="ts" setup>

import { VBtn } from "vuetify/components";

import { type UploadFile } from "@/models";

const props = defineProps<{
  file: UploadFile | null;
}>();

function download() {
  if (!props.file) return;

  const url = props.file?.url;
  if (!url) return;

  window.open(url, "_blank");
}

</script>

<template>
  <v-btn
    class="download-button"
    type="button"
    variant="text"
    color="primary"
    prepend-icon="mdi-download-outline"
    @click.prevent="download"
  >
    {{ file?.name }}
  </v-btn>
</template>

<style lang="scss" scoped>
.download-button {
  text-transform: none;
}
</style>
