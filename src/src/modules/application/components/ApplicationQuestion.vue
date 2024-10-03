<script lang="ts" setup>

import {
  VCard,
} from "vuetify/components";

import ApplicationQuestionFields from "./ApplicationQuestionFields.vue";
import { type ApplicationQuestion } from "@/models";

defineProps<{
  value: ApplicationQuestion[];
  disabled: boolean;
  isEdited: boolean;
}>();

</script>

<template>
  <VCard
    v-for="(question, idx) in value"
    :key="idx"
    class="panel__card"
    flat
  >
    <ApplicationQuestionFields
      :question="question"
      :idx="idx"
      :disabled="disabled"
      :is-edited="isEdited"
    />
  </VCard>
</template>

<style lang="scss" scoped>
.panel__card {
  font-size: 0.875rem;
  padding: 16px 24px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0;

  & + & {
    margin-top: 10px;
  }
}
</style>
