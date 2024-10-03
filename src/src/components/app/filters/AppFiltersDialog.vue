<script setup lang="ts">
import { computed } from "vue";
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
} from "vuetify/components";

type Props = {
  modelValue: boolean;
  loading?: boolean;
  closeOnSubmit?: boolean;
  disabled?: boolean;
  maxWidth?: number | string;
};

type Emits = {
  (e: "update:modelValue", value: boolean): void;
  (e: "cancel"): void;
  (e: "submit"): void;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  closeOnSubmit: true,
  maxWidth: 400,
});
const emit = defineEmits<Emits>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function onSubmit() {
  emit("submit");
  if (props.closeOnSubmit) model.value = false;
}
</script>

<template>
  <v-dialog
    v-model="model"
    :max-width="+maxWidth"
    class="app-filters-dialog"
  >
    <template #default>
      <v-card
        class="app-filters-dialog__card"
        :loading="loading"
      >
        <v-card-title class="px-6 pt-6 text-center">
          <slot name="title">
            Фильтры
          </slot>
        </v-card-title>
        <v-card-text class="px-6">
          <slot name="content" />
        </v-card-text>
        <v-card-actions class="px-6 pb-6 justify-end">
          <v-btn
            :disabled="loading"
            @click="$emit('cancel'), model = false"
          >
            <slot name="cancel">
              Сбросить
            </slot>
          </v-btn>
          <v-btn
            :color="loading || disabled ? 'accent' : 'primary'"
            variant="flat"
            :disabled="loading || disabled"
            @click="onSubmit"
          >
            <slot name="submit">
              Сохранить
            </slot>
          </v-btn>
          <v-btn
            class="app-filters-dialog__close"
            variant="text"
            icon="mdi-close"
            @click="model = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" scoped>
.app-filters-dialog {
  &__card {
    position: relative;
  }

  &__close {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
