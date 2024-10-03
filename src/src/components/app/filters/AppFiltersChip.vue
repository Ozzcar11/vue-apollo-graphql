<script lang="ts" setup generic="T">
import { VChip } from "vuetify/components";
import { isEmpty } from "@ozzcar11/utilities";

interface Props {
  value: T;
  closable?: boolean;
}

interface Emits {
  (e: "remove"): void;
}

withDefaults(defineProps<Props>(), {
  closable: true,
});
const emit = defineEmits<Emits>();
</script>

<template>
  <v-chip
    v-if="!isEmpty(value)"
    :closable="closable"
    @click:close="emit('remove')"
  >
    <slot />
  </v-chip>
</template>
