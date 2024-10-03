<script lang="ts" setup>
import {
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanels,
} from "vuetify/components";

import ApplicationQuestion from "./ApplicationQuestion.vue";
import { type Area } from "@/models";

defineProps<{
  value: Area[];
  disabled: boolean;
  isEdited: boolean;
}>();
</script>

<template>
  <VExpansionPanels
    v-for="(applicationArea) in value"
    :key="applicationArea.id"
  >
    <VExpansionPanel
      v-if="applicationArea.application_area_questions.length"
      :title="applicationArea.name"
      bg-color="grey-lighten-2"
      class="mb-5"
    >
      <VExpansionPanelText
        class="panel__text"
        eager
      >
        <ApplicationQuestion
          :value="applicationArea.application_area_questions"
          :disabled="disabled"
          :is-edited="isEdited"
        />
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="scss" scoped>
.panel__text {
  background-color: white !important;
}

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
