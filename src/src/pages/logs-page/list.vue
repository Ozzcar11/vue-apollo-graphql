<script setup lang="ts">
import { computed, ref } from "vue";

import { type BaseTableInstance, BaseTablePagination, useGenericTable } from "@ozzcar11/components";

import { useAsyncLoadings } from "@ozzcar11/utilities/composables";
import { dayjs } from "@ozzcar11/utilities/plugins";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { getFullName } from "@/modules/users/utils/getFullName";
import { useAuthStore } from "@/modules/auth/stores/auth";

import AppPageTitle from "@/components/app/page/AppPageTitle.vue";
import AppPageSearch from "@/components/app/page/AppPageSearch.vue";
import AppFiltersButton from "@/components/app/filters/AppFiltersButton.vue";
import AppFilters from "@/components/app/filters/AppFilters.vue";
import AppFiltersDialog from "@/components/app/filters/AppFiltersDialog.vue";
import AppFiltersChip from "@/components/app/filters/AppFiltersChip.vue";

import LogsFilters from "@/modules/logs-modules/components/LogsFilters.vue";

import { useLogsList } from "@/modules/logs-modules/composables/useLogsList";
import { logsList } from "@/router/routes/logs";
import { ACTIONS_NAMES, ACTIONS_TITLE, ACTIONS_TYPE_CRUD, PAGINATION_COLUMN } from "@/constants";
import { APPLICATION_STATUS_ACTION } from "@/modules/application/constants/status";
import { objectIsEmpty, removeEmptyArrays } from "@/utils";
import { type Log, type User } from "@/models";
import { headers } from "@/modules/logs-modules/constants/headers";

import { profileList } from "@/router/routes/profile";
import { usersShow } from "@/router/routes/users";
import { partnersUpdate } from "@/router/routes/partners";
import { applicationAbout } from "@/router/routes/application";

const { setBreadcrumbs } = useBreadcrumbsStore();
const authStore = useAuthStore();

const { filters, meta, logs, loading: logsListLoading } = useLogsList();
const loading = useAsyncLoadings([logsListLoading]);

const KRTable = useGenericTable<Log, typeof headers>();
const KRTableComponent = ref<BaseTableInstance | null>(null);

const filtersDialog = ref(false);

const logsListFilters = ref<InstanceType<typeof LogsFilters> | null>(null);

const actionLinks = {
  User: { name: usersShow.name },
  PartnerOffer: { name: partnersUpdate.name },
  UserApplication: { name: applicationAbout.name },
} as const;

const disableFilter = computed(() => objectIsEmpty(logsListFilters.value?.filters));

const userLink = (user: User) => {
  const currentUser = authStore.user;
  if (!user.id || !currentUser?.id) return "/";

  if (user.id === currentUser.id) {
    return {
      name: profileList.name,
    };
  }

  return {
    name: usersShow.name,
    params: { id: user.id },
  };
};

const actionLink = (log: Log) => {
  const data = log.data_after;
  if (!data?.__typename) return "/";

  if (data.id === authStore.user?.id) return profileList.path;

  return {
    ...actionLinks[data.__typename],
    params: {
      id: log.data_after?.id ?? 0,
      type: data.__typename === "UserApplication" ? "show" : undefined,
    },
  };
};

const getActionName = ({ action_type: actionType, data_after: dataAfter, data_before: dataBefore }: Log) => {
  if (actionType === ACTIONS_TYPE_CRUD.DELETE) {
    if (!dataBefore?.__typename) return "";

    if (dataBefore.__typename === "UserApplication") {
      return APPLICATION_STATUS_ACTION[dataBefore?.status ?? "in_work"];
    } else {
      return ACTIONS_NAMES[actionType][dataBefore.__typename];
    }
  }

  if (!dataAfter?.__typename) return "";

  if (dataAfter.__typename === "UserApplication") {
    if (!dataAfter.status) return "";

    return APPLICATION_STATUS_ACTION[dataAfter.status];
  } else {
    return ACTIONS_NAMES[actionType][dataAfter.__typename];
  }
};

function submitFilters() {
  if (!logsListFilters.value) return;

  const filter = removeEmptyArrays(logsListFilters.value.filters);

  filters.updateFilters({ filter });
}

function resetFilters() {
  logsListFilters.value?.reset();
  filters.reset();
}

setBreadcrumbs([
  {
    title: "Логирование",
    to: { name: logsList.name },
  },
]);

</script>

<template>
  <div class="container">
    <AppPageTitle title="Логирование">
      <template #search>
        <AppPageSearch
          v-model="filters.default.value.filter.search"
          placeholder="Поиск по ФИО"
        />
      </template>
      <template #buttons>
        <AppFiltersButton @click="filtersDialog = true" />
      </template>
    </AppPageTitle>
    <AppFilters
      :filters="filters.default.value.filter"
      :keys="['roles', 'action_filter', 'action_date_from', 'action_date_to']"
    >
      <template #default="{ items }">
        <AppFiltersChip
          v-if="items.roles"
          :value="items.roles"
          @remove="filters.resetExact('filter.roles')"
        >
          <span class="text-capitalize">
            {{ items?.roles[0]?.title }}
          </span>
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.action_filter"
          :value="items.action_filter"
          @remove="filters.resetExact('filter.action_filter')"
        >
          {{ ACTIONS_TITLE[items.action_filter] }}
        </AppFiltersChip>
        <AppFiltersChip
          v-if="items.action_date_from || items.action_date_to"
          :value="[items.action_date_from, items.action_date_to]"
          @remove="filters.resetExact('filter.action_date_from'), filters.resetExact('filter.action_date_to')"
        >
          <span>
            {{ dayjs(items.action_date_from).format("L") }}
          </span>
          <span
            v-if="items.action_date_to"
            class="mx-1"
          >
            - {{ dayjs(items.action_date_to).format("L") }}
          </span>
        </AppFiltersChip>
      </template>
    </AppFilters>
    <KRTable
      ref="KRTableComponent"
      class="mt-6"
      :headers="headers"
      :list="logs"
      :loading="loading"
      :has-actions="false"
      :params="filters.default.value"
      @update:params="filters.default.value = ($event as any)"
    >
      <template #item_full_name="{ item: { user } }">
        <RouterLink
          :to="userLink(user)"
          class="text-primary text-decoration-none"
        >
          {{ getFullName(user?.profile) }}
        </RouterLink>
      </template>
      <template #item_action_type="{ item }">
        <RouterLink
          v-if="item.action_type !== ACTIONS_TYPE_CRUD.DELETE"
          :to="actionLink(item)"
          class="text-primary text-decoration-none"
        >
          {{ getActionName(item) }}
        </RouterLink>
        <template v-else>
          {{ getActionName(item) }}
        </template>
      </template>
      <template #item_action_date="{ item }">
        {{ dayjs(item.action_date).format("L LT") }}
      </template>
      <template #[`item_role.title`]="{ item }">
        {{ item.user?.role?.title ?? "-" }}
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
    :disabled="disableFilter"
    @submit="submitFilters"
    @cancel="resetFilters"
  >
    <template #content>
      <LogsFilters
        ref="logsListFilters"
        :use-filters="filters.default.value"
        :visible="filtersDialog"
      />
    </template>
  </AppFiltersDialog>
</template>

<style lang="scss" scoped>
.table {
  &__names {
    white-space: pre-wrap;
  }
}
</style>
