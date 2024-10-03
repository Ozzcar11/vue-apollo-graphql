<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { type BaseTableInstance, BaseTablePagination, useGenericTable } from "@ozzcar11/components";
import {
  VAlert,
  VBtn,
  VCard,
  VCardActions,
  VCardTitle,
  VDialog,
  VFileInput,
  VIcon,
} from "vuetify/components";

import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { useClipboard } from "@vueuse/core";
import { useVuelidate } from "@vuelidate/core";
import { isEmpty } from "@ozzcar11/utilities";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useAuthStore } from "@/modules/auth/stores/auth";

import AppPageTitle from "@/components/app/page/AppPageTitle.vue";
import AppPageSearch from "@/components/app/page/AppPageSearch.vue";
import AppPageButton from "@/components/app/page/AppPageButton.vue";
import AppFiltersButton from "@/components/app/filters/AppFiltersButton.vue";
import AppFiltersDialog from "@/components/app/filters/AppFiltersDialog.vue";
import AppFiltersChip from "@/components/app/filters/AppFiltersChip.vue";
import AppFilters from "@/components/app/filters/AppFilters.vue";

import CompaniesFilters from "@/modules/companies/components/CompaniesFilters.vue";

import { companiesList } from "@/router/routes/companies";
import { useCompaniesList } from "@/modules/companies/composables/useCompaniesList";
import { FILE_SIZES, IMPORT_STATUS, PAGINATION_COLUMN } from "@/constants";
import { checkFileSize, checkFileType, refWithDefault, removeEmptyArrays } from "@/utils";
import { formatRevenue, getReadbleNumber } from "@/utils/formatters";
import { loadUserInvite } from "@/modules/users/utils/loadUserToken";
import { type Company, type ImportProcessingStatus } from "@/models";
import { headers } from "@/modules/companies/constants/headers";
import { REQUEST_ABORTED } from "@/constants/errors";
import { APPLICATION_STATUS_TITLE } from "@/modules/application/constants/status";

import { useImportFile } from "@/modules/file/composables/useImportFile";
import { loadImportStatus } from "@/modules/file/utils/loadImportStatus";
import { getCompanyLink } from "@/modules/companies/utils/getCompanyLink";

type ImportFileType = {
  import_type: string;
  file: File | null;
};

const authStore = useAuthStore();

const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();
const { copy } = useClipboard();
const { loadImportProcess } = loadImportStatus();

const { filters, meta, companies, loading: logsListLoading, refetch } = useCompaniesList();
const { fileImport, loading: importFileLoading, onDone, abort } = useImportFile();
const loading = useAsyncLoadings([logsListLoading]);

const KRTable = useGenericTable<Company, typeof headers>();
const KRTableComponent = ref<BaseTableInstance | null>(null);
const v = useVuelidate();

const filtersDialog = ref(false);
const importDialog = ref(false);
const clipboardDialog = ref(false);
const showAlert = ref(false);
const importStatus = ref<ImportProcessingStatus | null>(null);

const importData = ref<ImportFileType>({
  import_type: "SCORING",
  file: null,
});

const importFiles = refWithDefault<File[]>([]);

let checkImportStatus: ReturnType<typeof setInterval>;

const companiesListFilters = ref<InstanceType<typeof CompaniesFilters> | null>(null);

const filterEmpty = computed(() => Object.values(companiesListFilters.value?.filters ?? {}).every((item) => isEmpty(item)));

const getAlertValue = computed(() => {
  const alerts = {
    importing: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Пожалуйста, подождите пока файл обработается полностью",
    },
    failed: {
      type: "error",
      title: "Файл не загружен",
      text: "Проверьте целостность файла и повторите попытку",
    },
    syncing: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Синхронизация записей.",
    },
    indexing: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Индексация записей.",
    },
    scoring_calculating: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Расчёт скоринга.",
    },
    application_calculating: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Расчёт скоринга.",
    },
    companies_import_completed: {
      type: "warning",
      title: "Файл скоринга обрабатывается...",
      text: "Расчёт скоринга.",
    },
    completed: {
      type: "success",
      title: "Файл скоринга обрабатывается...",
      text: "Успешно загружен",
    },
  };

  return importStatus.value ? alerts[importStatus.value] : null;
});

async function submitFilters() {
  if (!companiesListFilters.value) return;

  const isValid = await v.value.$validate();
  if (!isValid) return;

  filtersDialog.value = false;

  const filter = removeEmptyArrays(companiesListFilters.value.filters);

  filters.updateFilters({ filter });
}

const companiesSearchFilter = computed({
  get() {
    return filters.default.value.filter.search;
  },
  set(value) {
    filters.default.value.filter.search = value || undefined;
  },
});

const disabledImport = computed(() => {
  if (!importStatus.value) return false;

  const validStatuses: ImportProcessingStatus[] = [IMPORT_STATUS.COMPLETED, IMPORT_STATUS.FAILED];

  return !validStatuses.includes(importStatus.value);
});

function cancelUploadFile() {
  importDialog.value = false;
  importFiles.ref.value = [];
  abort();
}

function resetFilters() {
  companiesListFilters.value?.reset();
  filters.reset();
}

async function getInviteOrResetValue(id: number) {
  try {
    const res = await loadUserInvite(id);

    return res?.data.inviteOrReset;
  } catch (e) {
    console.error(e);
    notificate("Не удалось получить ссылку", { type: "error" });
  }
}

async function getInviteAndSave(company: Company) {
  const inviteOrResetValue = await getInviteOrResetValue(company.id);

  if (!inviteOrResetValue) return;

  const inviteOrResetLink = inviteOrResetValue.status ? "reset" : "register";
  const token = inviteOrResetValue.token;

  try {
    await copy(`${import.meta.env.VITE_APP_PUBLIC_URL}/auth/${inviteOrResetLink}?token=${token}`);
    clipboardDialog.value = true;
  } catch (e) {
    console.error(e);
    notificate("Не удалось скопировать ссылку в буффер обмена", { type: "error" });
  }
}

setBreadcrumbs([
  {
    title: "Список компаний",
    to: { name: companiesList.name },
  },
]);

async function importFileSubmit() {
  if (!importData.value.file) return;

  try {
    await fileImport({ import: importData.value });
    refetch();
    importDialog.value = false;
    importStatus.value = IMPORT_STATUS.IMPORTING;
    showAlert.value = true;
    importFiles.reset();
  } catch (e) {
    if (e instanceof Error && e.message === REQUEST_ABORTED) return;

    console.error(e);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

async function showImportStatus() {
  try {
    const { data } = await loadImportProcess();
    const status = data.importProcessings?.status;

    if (!status || status === importStatus.value) return;

    if (status === IMPORT_STATUS.COMPLETED) {
      showAlert.value = false;
      clearInterval(checkImportStatus);
      refetch();
    } else {
      showAlert.value = true;
    }

    importStatus.value = status;
  } catch (error) {
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

function setImportCheck() {
  checkImportStatus = setInterval(() => {
    void showImportStatus();
  }, 10000);
}

onDone(() => {
  setImportCheck();
});

watch(() => importFiles.ref.value, (files: File[]) => {
  if (!files.length) return;

  const file = files[0];
  const isValid = checkFileSize(file, 10 * FILE_SIZES.GB) && checkFileType(file, [".csv"]);

  if (isValid) importData.value.file = file;
  else importFiles.ref.value = [];
});

onMounted(() => {
  void showImportStatus();
  setImportCheck();
});

onBeforeUnmount(() => clearInterval(checkImportStatus));
</script>

<template>
  <div class="container">
    <div class=" d-md-flex justify-space-between mb-4">
      <div class="text-h5 font-weight-regular mr-8 mb-4 mb-md-0">
        Список компаний
      </div>
      <VAlert
        v-model="showAlert"
        v-bind="getAlertValue"
        density="compact"
        max-width="600"
      />
    </div>
    <AppPageTitle>
      <template #search>
        <AppPageSearch
          v-model="companiesSearchFilter"
          placeholder="Наименование или ИНН"
        />
      </template>
      <template #buttons>
        <AppFiltersButton @click="filtersDialog = true" />
        <AppPageButton
          v-if="authStore.isSuperAdmin"
          :disabled="disabledImport"
          @click="importDialog = true"
        >
          Загрузить скоринг
        </AppPageButton>
      </template>
    </AppPageTitle>
    <AppFilters
      :filters="filters.default.value.filter"
      :keys="['region_registration', 'company_category', 'average_headcount_from', 'average_headcount_to', 'revenue_year_from', 'revenue_year_to', 'status', 'result_from', 'result_to']"
    >
      <template #default="{ items }">
        <AppFiltersChip
          :value="items.region_registration"
          @remove="filters.resetExact('filter.region_registration')"
        >
          <span class="text-capitalize">
            {{ items.region_registration?.name }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          :value="items.company_category"
          @remove="filters.resetExact('filter.company_category')"
        >
          <span class="text-capitalize">
            {{ items.company_category?.name }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.average_headcount_from || items.average_headcount_to"
          :value="[items.average_headcount_from, items.average_headcount_to]"
          @remove="filters.resetExact('filter.average_headcount_from'), filters.resetExact('filter.average_headcount_to')"
        >
          <span class="text-capitalize">
            {{ items.average_headcount_from ?? 0 }} {{ items.average_headcount_to ? `- ${items.average_headcount_to}` : "" }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.revenue_year_from || items.revenue_year_to"
          :value="[items.revenue_year_from, items.revenue_year_to]"
          @remove="filters.resetExact('filter.revenue_year_from'), filters.resetExact('filter.revenue_year_to')"
        >
          <span class="text-capitalize">
            {{ items.revenue_year_from ?? 0 }} {{ items.revenue_year_to ? `- ${items.revenue_year_to}` : "" }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.result_from || items.result_to"
          :value="[items.result_from, items.result_to]"
          @remove="filters.resetExact('filter.result_from'), filters.resetExact('filter.result_to')"
        >
          <span class="text-capitalize">
            {{ items.result_from ?? 0 }} {{ items.result_to ? `- ${items.result_to}` : "" }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.status"
          :value="items.status"
          @remove="filters.resetExact('filter.status')"
        >
          {{ APPLICATION_STATUS_TITLE[items.status] }}
        </AppFiltersChip>
      </template>
    </AppFilters>
    <KRTable
      ref="KRTableComponent"
      class="mt-6"
      :headers="headers"
      :list="companies"
      :loading="loading"
      :has-actions="!loading && authStore.isSuperAdmin"
      :has-actions-edit="false"
      :has-actions-show="false"
      :has-actions-delete="false"
      :params="filters.default.value"
      @update:params="filters.default.value = ($event as any)"
    >
      <template #item_name="{ item }">
        <a
          class="text-primary text-decoration-none"
          :href="getCompanyLink(item.inn)"
          target="_blank"
        >{{ item.name }}</a>
      </template>
      <template #item_company_category="{ item }">
        {{ item.company_category?.name }}
      </template>
      <template #item_average_headcount="{ item }">
        {{ item.average_headcount ? getReadbleNumber(item.average_headcount) : '-' }}
      </template>
      <template #item_region_registration="{ item }">
        {{ item.region_registration?.name }}
      </template>
      <template #item_revenue_year="{ item }">
        {{ item.revenue_year ? formatRevenue(item.revenue_year) : "-" }}
      </template>
      <template #item_actions_prepend="{ item }">
        <VBtn
          icon="mdi-email-plus-outline"
          variant="text"
          density="comfortable"
          @click="getInviteAndSave(item)"
        />
      </template>
      <template #item_status="{ item }">
        <VIcon
          icon="mdi-checkbox-marked-circle"
          :color="item.status === null || item.status === 'ready_to_assessment' ? 'grey-lighten-1' : 'success'"
        />
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
  </div>
  <AppFiltersDialog
    v-model="filtersDialog"
    max-width="720"
    :close-on-submit="false"
    :disabled="filterEmpty"
    @submit="submitFilters"
    @cancel="resetFilters"
  >
    <template #content>
      <CompaniesFilters
        ref="companiesListFilters"
        :use-filters="filters.default.value"
        :visible="filtersDialog"
      />
    </template>
  </AppFiltersDialog>
  <VDialog
    v-model="importDialog"
    max-width="400"
    :loading="importFileLoading"
  >
    <VCard class="company-import-dialog">
      <VCardTitle class="company-import-dialog__title">
        Загрузка файла скоринга
      </VCardTitle>
      <VFileInput
        v-model="importFiles.ref.value"
        accept=".csv"
        label="Загрузить файл"
        hint="Только .CSV формат. Файл не должен весить больше 10 Гб"
        prepend-inner-icon="mdi-paperclip"
        prepend-icon=""
        persistent-hint
        density="comfortable"
        clear-icon="mdi-close"
        :loading="importFileLoading"
      />
      <VCardActions class="d-flex justify-end pa-0">
        <VBtn @click="cancelUploadFile">
          Отмена
        </VBtn>
        <VBtn
          variant="elevated"
          :color="!importData || importFileLoading ? 'accent' : 'primary'"
          :disabled="!importData || importFileLoading"
          :loading="importFileLoading"
          @click="importFileSubmit"
        >
          Сохранить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog
    v-model="clipboardDialog"
    max-width="400"
  >
    <VCard class="dialog">
      <VCardTitle class="dialog__title">
        Ссылка скопирована в буфер обмена
      </VCardTitle>
      <VBtn
        class="dialog__close-btn"
        icon="mdi-close"
        variant="text"
        @click="clipboardDialog = false"
      />
    </VCard>
  </VDialog>
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

.company-import-dialog {
  padding: 24px;

  &__title {
    font-size: 1.5rem;
    padding: 0;
    margin-bottom: 24px;
  }
}
</style>
