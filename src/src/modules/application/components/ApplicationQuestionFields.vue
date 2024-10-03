<script lang="ts" setup>
import { computed, unref } from "vue";
import { requiredIf } from "@ozzcar11/utilities/validators";
import { useVuelidate } from "@vuelidate/core";
import {
  VAlert,
  VCol,
  VRow,
  VSelect,
  VTextarea,
} from "vuetify/components";

import BaseFileDownload from "@/components/base/BaseFileDownload.vue";

import { type ApplicationQuestion } from "@/models";

const props = defineProps<{
  question: ApplicationQuestion;
  idx: number;
  disabled: boolean;
  isEdited: boolean;
}>();

const questionValue = computed(() => props.question.user_application_questionnaires[0]);
const questionItems = computed(() => {
  const items = props.question.question_canned_answers.map(item => ({
    value: item.points ?? 0,
  }));

  return items.sort((a, b) => a.value - b.value);
});

const hideValue = computed(() => {
  const hideValues = ["revenue_name", "investments_name"];

  return hideValues.includes(props.question.system_name) || questionItems.value.every(item => item.value === 0);
});

const questionDisabled = computed(() => !questionValue.value.is_edited ? props.isEdited || props.disabled : false);

const rules = computed(() => ({
  user_question_scoring: {
    points: { required: requiredIf(!hideValue.value) },
  },
}));

const v = useVuelidate(rules, questionValue);
</script>

<template>
  <v-alert
    v-if="props.question.user_application_questionnaires[0]?.is_edited"
    class="panel__alert"
    color="warning"
    icon="mdi-alert-outline"
    variant="outlined"
    text="Вопрос обновлен компанией, его необходимо оценить снова"
  />
  <VRow>
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Вопрос {{ question.user_application_questionnaires[0]?.questionIndex ?? idx + 1 }}:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      {{ question.user_application_questionnaires[0]?.question?.text ?? "-" }}
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Ответ представителя:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      {{ question.user_application_questionnaires?.[0]?.answer?.text ?? question.user_application_questionnaires?.[0]?.value ?? "-" }}
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Комментарий представителя:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      {{ question.user_application_questionnaires?.[0]?.company_comment ?? "-" }}
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Подтверждающие материалы:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      <base-file-download
        v-for="(item, docIdx) in question.user_application_questionnaires?.[0]?.documents"
        :key="docIdx"
        :file="item.file"
      />
    </VCol>
  </VRow>
  <VRow v-if="!hideValue">
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Количество баллов:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      <VSelect
        v-model="questionValue.user_question_scoring.points"
        label="Количество баллов"
        :items="questionItems"
        :item-title="item => item.value"
        :error-messages="v.user_question_scoring.points.$errors.map((e) => unref(e.$message))"
        :disabled="questionDisabled"
      />
    </VCol>
  </VRow>
  <VRow v-if="question.system_name !== 'revenue_name'">
    <VCol
      cols="12"
      md="2"
      class="panel__lable"
    >
      Комментарий проверяющего:
    </VCol>
    <VCol
      cols="12"
      md="10"
    >
      <VTextarea
        v-model="questionValue.user_question_scoring.expert_comment"
        placeholder="Комментарий проверяющего"
        density="comfortable"
        :disabled="questionDisabled"
        hide-details
      />
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.panel__lable {
  opacity: 0.58;
}

.panel__alert {
  margin-bottom: 16px;
  font-size: 16px;
}
</style>
