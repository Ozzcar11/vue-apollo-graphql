<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { type BaseTableInstance, BaseTablePagination, useGenericTable } from "@ozzcar11/components";
import { useRole } from "v-role";

import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VListItem,
  VSelect,
} from "vuetify/components";

import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";

import { dayjs } from "@ozzcar11/utilities/plugins";
import { usersList } from "@/router/routes/users";

import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

import AppPageTitle from "@/components/app/page/AppPageTitle.vue";
import AppPageSearch from "@/components/app/page/AppPageSearch.vue";
import AppTableDropdown from "@/components/app/AppTableDropdown.vue";

import AppFilters from "@/components/app/filters/AppFilters.vue";
import AppFiltersButton from "@/components/app/filters/AppFiltersButton.vue";
import AppFiltersChip from "@/components/app/filters/AppFiltersChip.vue";
import AppFiltersDialog from "@/components/app/filters/AppFiltersDialog.vue";
import ApplicationFilters from "@/modules/application/components/ApplicationFilters.vue";

import { useApplicationList } from "@/modules/application/composables/useApplicationList";
import { useResponsiblesList } from "@/modules/application/composables/useResponsiblesList";
import { useResponsibleUpdate } from "@/modules/application/composables/useResponsibleUpdate";
import { useApplicationUpdate } from "@/modules/application/composables/useApplicationUpdate";

import { objectIsEmpty, removeEmptyArrays } from "@/utils";

import { PAGINATION_COLUMN, ROLES } from "@/constants";
import { headers } from "@/modules/application/constants/headers";
import { getFullName } from "@/modules/users/utils/getFullName";

import { type Application, type User } from "@/models";
import { APPLICATION_STATUS, APPLICATION_STATUS_TITLE, type STATUS_VALUE_TYPE } from "@/modules/application/constants/status";
import { applicationAbout } from "@/router/routes/application";
import { getCompanyLink } from "@/modules/companies/utils/getCompanyLink";

const router = useRouter();
const { hasAnyRole } = useRole();

const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();

const { filters, meta, applications, loading: applicationListLoading, refetch } = useApplicationList();
const { updateApplication, loading: applicationUpdateLoading } = useApplicationUpdate();
const { responsibles } = useResponsiblesList();
const { updateResponsible } = useResponsibleUpdate();
const loading = useAsyncLoadings([applicationListLoading, applicationUpdateLoading]);

const filtersDialog = ref(false);
const resposibleDialog = ref(false);
const application = ref<Application | null>(null);
const responsible = ref<User | null>(null);
const applicationFilters = ref<InstanceType<typeof ApplicationFilters> | null>(null);

const KRTable = useGenericTable<Application, typeof headers>();
const KRTableComponent = ref<BaseTableInstance | null>(null);

const filterDisabled = computed(() => objectIsEmpty(applicationFilters.value?.filters));

setBreadcrumbs([
  {
    title: "Анкетирование",
    to: { name: usersList.name },
  },
]);

function submitFilters() {
  if (!applicationFilters.value) return;

  const filter = removeEmptyArrays(applicationFilters.value.filters);

  filters.updateFilters({ filter });
}

function resetFilters() {
  applicationFilters.value?.reset();
  filters.reset();
}

async function setResponsible() {
  if (!application.value && !responsible.value) return;

  const userApplicationResponsible = {
    user_application: {
      id: application.value?.id ?? -1,
    },
    user: responsible.value,
  };

  try {
    await updateResponsible({ userApplicationResponsible });
    if (application.value?.status === APPLICATION_STATUS.UNALLOCATED) {
      await updateApplication({
        userApplication: {
          id: application.value?.id ?? -1,
          status: APPLICATION_STATUS.READY_TO_ASSESSMENT,
        },
      });
    }
    resposibleDialog.value = false;
    refetch();
  } catch (e) {
    console.error(e);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

function toAboutPage(application: Application, type: "edit" | "show" = "edit") {
  void router.push({ name: applicationAbout.name, params: { id: application.id, type } });
}

</script>

<template>
  <div class="container">
    <AppPageTitle title="Анкетирование">
      <template #search>
        <AppPageSearch
          v-model="filters.default.value.filter.search"
          placeholder="Наименование или ИНН"
        />
      </template>
      <template #buttons>
        <AppFiltersButton @click="filtersDialog = true" />
      </template>
    </AppPageTitle>
    <AppFilters
      :filters="filters.default.value.filter"
      :keys="['responsible', 'status', 'date']"
    >
      <template #default="{ items }">
        <AppFiltersChip
          v-if="items.responsible"
          :value="items.responsible"
          @remove="filters.resetExact('filter.responsible')"
        >
          <span class="text-capitalize">
            {{ getFullName(items.responsible.profile) }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.status"
          :value="items.status"
          @remove="filters.resetExact('filter.status')"
        >
          {{ APPLICATION_STATUS_TITLE[items.status] }}
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.date"
          :value="items.date"
          @remove="filters.resetExact('filter.date')"
        >
          <span class="text-capitalize">
            {{ dayjs(items.date).format("L") }}
          </span>
        </AppFiltersChip>
      </template>
    </AppFilters>
    <KRTable
      ref="KRTableComponent"
      class="mt-6"
      :headers="headers"
      :list="applications"
      :loading="loading"
      :has-actions="!loading"
      :has-actions-edit="false"
      :has-actions-show="false"
      :has-actions-delete="false"
      :params="filters.default.value"
      @update:params="filters.default.value = ($event as any)"
    >
      <template #item_name="{ item: { user } }">
        <a
          v-if="user?.company?.inn"
          class="text-primary text-decoration-none"
          :href="getCompanyLink(user?.company?.inn)"
          target="_blank"
        >{{ user.company?.name }}</a>
        <span
          v-else-if="user?.company?.name"
        >{{ user.company?.name }}</span>
        <span v-else> - - - </span>
      </template>
      <template #item_inn="{ item }">
        {{ item.user?.company?.inn ?? "-" }}
      </template>
      <template #[`item_responsible.name`]="{ item }">
        {{ getFullName(item.user_application_responsibles?.user?.profile) }}
      </template>
      <template #item_status="{ item }">
        {{ APPLICATION_STATUS_TITLE[item.status as STATUS_VALUE_TYPE] }}
      </template>
      <template #item_date="{ item }">
        {{ dayjs(item.created_at).format("L") }}
      </template>
      <template #item_actions_prepend="{ item }">
        <AppTableDropdown
          hide-all
        >
          <VListItem
            v-if="!hasAnyRole([ROLES.WATCHER])"
            @click="toAboutPage(item)"
          >
            {{ "Оценить анкету" }}
          </VListItem>
          <VListItem
            v-if="hasAnyRole([ROLES.WATCHER, ROLES.SUPERADMIN])"
            @click="toAboutPage(item, 'show')"
          >
            {{ "Просмотр анкеты" }}
          </VListItem>
          <VListItem
            v-if="hasAnyRole([ROLES.SUPERADMIN, ROLES.ADMIN])"
            @click="application = item, resposibleDialog = true, responsible = null"
          >
            Распределить
          </VListItem>
        </AppTableDropdown>
      </template>
    </KRTable>
    <BaseTablePagination
      v-model="filters.default.value"
      :meta="meta"
      class="table-pagination"
      :col-classes="{
        second: PAGINATION_COLUMN,
      }"
    />
    <AppFiltersDialog
      v-model="filtersDialog"
      :disabled="filterDisabled"
      @submit="submitFilters"
      @cancel="resetFilters"
    >
      <template #content>
        <ApplicationFilters
          ref="applicationFilters"
          :use-filters="filters.default.value"
          :visible="filtersDialog"
        />
      </template>
    </AppFiltersDialog>
    <VDialog
      v-model="resposibleDialog"
      max-width="400"
    >
      <VCard class="px-6 pt-6 pb-4">
        <VCardTitle class="px-0 pt-0 dialog__title">
          Выбрать проверяющего
        </VCardTitle>
        <VCardText class="px-0">
          <VSelect
            v-model="responsible"
            class="mb-4"
            label="Проверяющий"
            hint="В списке указаны все свободные эксперты"
            :items="responsibles"
            :item-title="(item: User) => getFullName(item.profile)"
            return-object
            persistent-hint
          />
        </VCardText>
        <VCardActions class="justify-end py-0">
          <VBtn
            @click="resposibleDialog = false"
          >
            Отмена
          </VBtn>
          <VBtn
            :color="!responsible ? 'accent' : 'primary'"
            :disabled="!responsible"
            variant="flat"
            @click="setResponsible"
          >
            Сохранить
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__names {
    white-space: pre-wrap;
  }
}

.dialog {
  font-size: 24px;
  font-weight: 500 !important;
  padding: 8px;
  padding-right: 30px;

  &__title {
    font-size: 24px;
    white-space: wrap;
  }

  &__close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

</style>
