<script setup lang="ts">
import { computed, ref } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { cloneDeep } from "lodash-es";
import { useVuelidate } from "@vuelidate/core";

import { VBtn } from "vuetify/components";
import { refWithDefault } from "@/utils";

import AppDialog from "@/components/app/AppDialog.vue";
import ApplicationExpansion from "@/modules/application/components/ApplicationExpansion.vue";
import ApplicationHeader from "@/modules/application/components/ApplicationHeader.vue";

import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

import { type QuestionInput, useQuestionsSync } from "@/modules/application/composables/useQuestionsSync";
import { useApplicationTreeGet } from "@/modules/application/composables/useApplicationTreeGet";
import { useApplicationGet } from "@/modules/application/composables/useApplicationGet";
import { useApplicationUpdate } from "@/modules/application/composables/useApplicationUpdate";

import { APPLICATION_STATUS, APPLICATION_STATUS_TITLE, APPLICATION_STEPS } from "@/modules/application/constants";

import { applicationAbout, applicationList, applicationPersonnel } from "@/router/routes/application";

import { type Area } from "@/models";

const route = useRoute();
const router = useRouter();

const ignoreLeave = ref(false);
const cancelDialog = ref(false);
const routeSave = ref<RouteLocationRaw>();

const id = +route.params.id;
const type = route.params.type;

const { syncQuestions, loading: questionsLoading } = useQuestionsSync();
const { applicationTree, loading: treeLoading, onResult: onResultTree } = useApplicationTreeGet({ user_application: { id } });
const { application, loading: applicationLoading, onResult } = useApplicationGet(id);
const { updateApplication, loading: applicationUpdateLoading } = useApplicationUpdate();

const loading = useAsyncLoadings([treeLoading, applicationLoading, questionsLoading, applicationUpdateLoading]);

const { setBreadcrumbs } = useBreadcrumbsStore();
const { notificate } = useNotifications();

const applicationData = refWithDefault<Area[]>([]);

const disableNextButton = computed(() => {
  if (type === "show") return false;

  return loading.value || v.value.$invalid;
});

const v = useVuelidate();

onResult(() => {
  if (!application.value) return;

  setBreadcrumbs([
    {
      title: "Анкетирование",
      to: { name: applicationList.name },
    },
    {
      title: application.value.user.company?.name ?? "- - -",
      to: { name: applicationAbout.name, params: { id: id.toString() } },
    },
  ]);
});

onResultTree(() => {
  if (!applicationTree.value) return;

  const applicationDataValue = cloneDeep(applicationTree.value?.find(item => item.name === APPLICATION_STEPS.ECOLOGY)?.children) ?? [];

  applicationData.ref.value = applicationDataValue.map((item) => ({
    ...item,
    application_area_questions: item.application_area_questions.map((question) => ({
      ...question,
      user_application_questionnaires: question.user_application_questionnaires.map((answer) => ({
        ...answer,
        user_question_scoring: answer.user_question_scoring ?? { points: null, expert_comment: "" },
      })),
    })),
  }));

  applicationData.saveAsDefault();
});

function toListPage() {
  void router.push({ name: applicationList.name });
}

function toNextPage() {
  cancelDialog.value = false;

  if (routeSave.value) {
    ignoreLeave.value = true;
    void router.push(routeSave.value);
  }
}

function toNextStepPage() {
  void router.push({ name: applicationPersonnel.name, params: { id: id.toString(), type } });
}

function toPrevStepPage() {
  void router.push({ name: applicationAbout.name, params: { id: id.toString(), type } });
}

function syncApplicationHandler(nextPage: boolean = false) {
  cancelDialog.value = false;

  switch (type) {
    case "show": {
      toNextStepPage();
      break;
    }
    case "edit": {
      void syncApplication(nextPage);
      break;
    }
  }
}

function statusHandler() {
  if (application.value?.status !== APPLICATION_STATUS.PROCESSED) {
    void updateApplication({
      userApplication: {
        id,
        status: APPLICATION_STATUS.IN_WORK,
      },
    });
  }
}

async function syncApplication(nextPage: boolean = false) {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  const userQuestionScorings: QuestionInput[] = [];

  for (const item of applicationData.ref.value) {
    for (const question of item.application_area_questions) {
      for (const answer of question.user_application_questionnaires) {
        userQuestionScorings.push({
          points: answer.user_question_scoring.points,
          expert_comment: answer.user_question_scoring.expert_comment,
          user_application_questionnaire: {
            id: answer.id,
          },
        });
      }
    }
  }

  try {
    await syncQuestions({
      userQuestionScoringsSync: {
        userQuestionScorings,
        projects: [],
      },
    });

    statusHandler();

    applicationData.saveAsDefault();

    if (nextPage) toNextPage();
    else {
      toNextStepPage();
    }
  } catch (e) {
    console.error(e);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

onBeforeRouteLeave((value) => {
  if (!applicationData.isDefault() && !ignoreLeave.value) {
    cancelDialog.value = true;
    routeSave.value = value;

    return false;
  }
});
</script>

<template>
  <div class="container">
    <ApplicationHeader
      v-if="application"
      :title="application?.user.company?.name"
      :status="APPLICATION_STATUS_TITLE[application.status]"
      :step="APPLICATION_STEPS.ECOLOGY"
    />
    <ApplicationExpansion
      :value="applicationData.ref.value"
      :disabled="type === 'show'"
      :is-edited="application?.is_edited ?? false"
    />
  </div>

  <footer class="container d-flex mt-auto py-4 py-md-8 footer">
    <VBtn
      class="mr-4"
      :color="disableNextButton ? 'accent' : 'primary'"
      :disabled="disableNextButton"
      :loading="loading"
      @click="syncApplicationHandler(false)"
    >
      Далее
    </VBtn>
    <VBtn
      class="mr-4"
      @click="toPrevStepPage"
    >
      Назад
    </VBtn>
    <VBtn @click="toListPage">
      Отмена
    </VBtn>
  </footer>
  <AppDialog
    v-model="cancelDialog"
    submit-color="black"
    cancel-color="error"
    @submit="syncApplicationHandler(true)"
    @cancel="toNextPage()"
  >
    <template #title>
      Вы хотите сохранить изменения?
    </template>
    <template #description>
      Вы покинете режим редактирования, сохранить внесённые изменения?
    </template>
    <template #submit>
      Сохранить
    </template>
    <template #cancel>
      Не сохранять
    </template>
  </AppDialog>
</template>

<style scoped lang="scss">
.footer {
  box-shadow: 0 -2px 4px 0 #0003;
}
</style>
