<script lang="ts" setup>

import {
  VCard,
  VCol,
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanels,
  VRow,
  VTextarea,
} from "vuetify/components";

import { dayjs } from "@ozzcar11/utilities/plugins";
import BaseFileDownload from "@/components/base/BaseFileDownload.vue";

import { type ApplicationProject } from "@/models/application";

defineProps<{
  projects: ApplicationProject[];
  disabled: boolean;
}>();

</script>

<template>
  <VExpansionPanels class="mb-5">
    <VExpansionPanel
      title="Информация о проектах"
      bg-color="grey-lighten-2"
    >
      <VExpansionPanelText
        class="panel__text"
        eager
      >
        <VCard
          v-for="(project, idx) in projects"
          :key="idx"
          class="panel__card"
          flat
        >
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Проект {{ idx + 1 }}
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Название проекта:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ project.name }}
            </VCol>
          </VRow>
          <VRow v-if="project.project_direction">
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Направление:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ project.project_direction.name }}
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Описание проекта:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ project.description }}
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Место реализации проекта:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ project.place }}
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Сроки реализации проекта:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ dayjs(project.date_start).format("DD MMM YYYY") }} - {{ dayjs(project.date_end).format("DD MMM YYYY") }}
            </VCol>
          </VRow>
          <VRow>
            <VCol
              cols="12"
              md="2"
              class="panel__lable"
            >
              Объем средств:
            </VCol>
            <VCol
              cols="12"
              md="10"
            >
              {{ project.investment_volume }}
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
              -
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
                v-for="(item, docIdx) in project.documents"
                :key="docIdx"
                :file="item.file"
              />
            </VCol>
          </VRow>
          <VRow>
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
                v-model="project.expert_comment"
                placeholder="Комментарий проверяющего"
                density="comfortable"
                :disabled="disabled"
                hide-details
              />
            </VCol>
          </VRow>
        </VCard>
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

.panel__lable {
  opacity: 0.58;
}
</style>
