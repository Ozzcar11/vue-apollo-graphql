<script setup lang="ts">
import { computed } from "vue";
import { VTextField } from "vuetify/components";
import { debounce } from "@ozzcar11/utilities";

type Model = string | number | undefined | null;

type Props = {
  modelValue: Model;
  placeholder?: string;
  clearable?: boolean;
  clearIcon?: string;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Поиск",
  clearable: true,
  clearIcon: "mdi-close",
});
const emit = defineEmits<{
  (e: "update:modelValue", value: Model): void;
}>();

const debounced = debounce((value: Model) => {
  emit("update:modelValue", value);
}, 500);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    debounced(value);
  },
});
</script>

<template>
  <v-text-field
    v-model="model"
    :placeholder="placeholder"
    :hide-details="true"
    :clearable="clearable"
    :clear-icon="clearIcon"
    @keyup.enter="model = $event.target.value"
    @click:clear="model = ''"
  />
</template>
