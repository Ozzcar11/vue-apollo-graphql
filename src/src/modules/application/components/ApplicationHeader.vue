<script lang="ts" setup>
import { useRoute } from "vue-router";
import { type ValueOf } from "@ozzcar11/utilities/types";
import {
  VChip,
  VDivider,
  VStepper,
  VStepperHeader,
  VStepperItem,
} from "vuetify/components";

import { applicationAbout } from "@/router/routes/application";

import { APPLICATION_STEPS } from "@/modules/application/constants/steps";

defineProps<{
  title?: string;
  status?: string;
  step: ValueOf<typeof APPLICATION_STEPS>;
}>();

const route = useRoute();
const id = route.params.id;

const steps = ["Экология", "Кадры", "Государство", "Взаимодействие с бизнес-объединениями"] as const;

</script>

<template>
  <div class="text-h5 font-weight-regular mb-4 mb-md-8">
    <RouterLink
      class="text-primary text-decoration-none mr-5"
      :to="{ name: applicationAbout.name, params: { id } }"
    >
      {{ title ?? "- - -" }}
    </RouterLink>
    <VChip>
      {{ status ?? "-" }}
    </VChip>
  </div>
  <VStepper
    :model-value="steps.indexOf(step)"
    alt-labels
    hide-actions
    flat
  >
    <VStepperHeader>
      <VStepperItem
        color="primary"
        value="1"
      >
        Экология
      </VStepperItem>
      <VDivider />
      <VStepperItem
        color="primary"
        value="2"
      >
        Кадры
      </VStepperItem>
      <VDivider />
      <VStepperItem
        color="primary"
        value="3"
      >
        Государство
      </VStepperItem>
      <VDivider />
      <VStepperItem
        color="primary"
        value="4"
        class="text-no-wrap"
      >
        Взаимодействие с бизнес-объединениями
      </VStepperItem>
    </VStepperHeader>
  </VStepper>
</template>
