<script lang="ts" setup generic="T extends string | number | undefined">
import { VChip } from "vuetify/components";

type Props = {
  modelValue: T[] | null;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Props["modelValue"]): void;
}>();

function removeItem(item: T) {
  if (!props.modelValue) {
    emit("update:modelValue", null);

    return;
  }
  const filteredItems = props.modelValue.filter(value => item !== value);
  emit("update:modelValue", filteredItems.length === 0 ? null : filteredItems);
}
</script>

<template>
  <v-chip
    v-for="item of modelValue"
    :key="item"
    closable
    @click:close="removeItem(item)"
  >
    <slot :item="item">
      {{ item }}
    </slot>
  </v-chip>
</template>
