<script setup lang="ts">
import { computed } from "vue";
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VDivider,
} from "vuetify/components";

type Props = {
  modelValue: boolean;
  loading?: boolean;
  submitColor?: string;
  cancelColor?: string;
};

type Emits = {
  (e: "update:modelValue", value: boolean): void;
  (e: "cancel"): void;
  (e: "submit"): void;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitColor: "error",
  cancelColor: "black",
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
</script>

<template>
  <v-dialog
    v-model="model"
    max-width="400"
    :persistent="true"
  >
    <template #default>
      <v-card :loading="loading">
        <v-card-title>
          <slot name="title">
            Подтвердите действие
          </slot>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="$slots.description">
          <slot name="description" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            :color="cancelColor"
            :disabled="loading"
            @click="$emit('cancel'), model = false"
          >
            <slot name="cancel">
              Отменить
            </slot>
          </v-btn>
          <v-btn
            :color="submitColor"
            :disabled="loading"
            @click="$emit('submit')"
          >
            <slot name="submit">
              Выйти
            </slot>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
