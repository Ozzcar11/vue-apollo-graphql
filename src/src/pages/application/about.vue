<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type Nullable } from "@ozzcar11/utilities/types";

import {
  VBtn,
  VChip,
  VStepper,
} from "vuetify/components";

import AppLable from "@/components/app/AppLable.vue";

import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useApplicationGet } from "@/modules/application/composables/useApplicationGet";
import { applicationAbout, applicationEcology, applicationList } from "@/router/routes/application";
import { getFullName } from "@/modules/users/utils/getFullName";
import { stringToPhone } from "@/utils/formatters";
import { APPLICATION_STATUS_TITLE } from "@/modules/application/constants";
import { type Company, type ContactPerson } from "@/models";

type ApplicationDataType = Nullable<{
  company: Company;
  contact: ContactPerson;
}>;

const route = useRoute();
const router = useRouter();

const id = +route.params.id;
const type = route.params.type;

const { setBreadcrumbs } = useBreadcrumbsStore();

const { application, loading, onResult } = useApplicationGet(id);

const applicationData = ref<ApplicationDataType>({
  company: null,
  contact: null,
});

onResult(() => {
  if (!application.value) return;

  applicationData.value = {
    company: application.value.user.company,
    contact: application.value.user.company?.contact_person,
  };

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

function toListPage() {
  void router.push({ name: applicationList.name });
}

</script>

<template>
  <div class="container">
    <div class="text-h5 font-weight-regular mb-4 mb-md-8">
      <span class="mr-5">{{ applicationData.company?.name ?? "- - -" }}</span>
      <VChip v-if="application">
        {{ APPLICATION_STATUS_TITLE[application.status] }}
      </VChip>
    </div>

    <VStepper
      :items="['Экология', 'Кадры', 'Государство', 'Взаимодействие с бизнес-объединениями']"
      alt-labels
      hide-actions
      color="primary"
      disabled
      flat
    />

    <div class="text-h6 font-weight-regular mb-6">
      Основная информация о компании
    </div>
    <div class="about-content">
      <AppLable label="Полное наименование">
        {{ applicationData.company?.name ?? "- - -" }}
      </AppLable>
      <AppLable label="Категория">
        {{ applicationData.company?.company_category.name ?? "- - -" }}
      </AppLable>
      <AppLable label="ИНН">
        {{ applicationData.company?.inn ?? "- - -" }}
      </AppLable>
      <AppLable label="Регион присутствия">
        {{ applicationData.company?.region_presences.map((e) => e.name).join(", ") ?? "- - -" }}
      </AppLable>
      <AppLable label="Среднесписочная численность сотрудников">
        {{ applicationData.company?.average_headcount ?? "- - -" }}
      </AppLable>
      <AppLable label="Адрес интернет-сайта компании">
        <a
          class="text-primary text-decoration-none"
          :href="applicationData.company?.link"
          target="_blank"
        >
          {{ applicationData.company?.link ?? "- - -" }}
        </a>
      </AppLable>
      <AppLable label="Товарные знаки компании">
        {{ applicationData.company?.trademarks ?? "- - -" }}
      </AppLable>
      <AppLable label="Краткие сведения о товарах">
        {{ applicationData.company?.product_information ?? "- - -" }}
      </AppLable>
    </div>
    <div class="text-h6 font-weight-regular my-6">
      Контактное лицо компании
    </div>
    <div class="about-contact">
      <AppLable label="ФИО">
        {{ getFullName(applicationData.contact) ?? "- - -" }}
      </AppLable>
      <AppLable label="Должность">
        {{ applicationData.contact?.position ?? "- - -" }}
      </AppLable>
      <AppLable label="Телефон">
        {{ applicationData.contact?.phone ? stringToPhone(applicationData.contact?.phone) : "- - -" }}
      </AppLable>
      <AppLable label="Электронная почта">
        {{ applicationData.contact?.email ?? "- - -" }}
      </AppLable>
      <AppLable label="Дополнительная информация">
        {{ applicationData.contact?.add_information ?? "- - -" }}
      </AppLable>
    </div>
  </div>
  <footer class="container d-flex mt-auto py-4 py-md-8 footer">
    <VBtn
      class="mr-4"
      color="primary"
      :disabled="loading"
      :loading="loading"
      :to="{ name: applicationEcology.name, params: { id: id.toString(), type } }"
    >
      Далее
    </VBtn>
    <VBtn @click="toListPage">
      Отмена
    </VBtn>
  </footer>
</template>

<style lang="scss" scoped>
.about {
  &-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  &-contact {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
  }
}

.footer {
  box-shadow: 0 -2px 4px 0 #0003;
}
</style>
