<script setup lang="ts">
import { computed, ref } from "vue";

import { useRouter } from "vue-router";

import { type BaseTableInstance, BaseTablePagination, useGenericTable } from "@ozzcar11/components";

import {
  VBtn,
  VCard,
  VCardTitle,
  VDialog,
} from "vuetify/components";

import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { dayjs } from "@ozzcar11/utilities/plugins";
import { useRole } from "v-role";

import { type TableFrom } from "@ozzcar11/utilities/types";
import { usersList } from "@/router/routes/users";

import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useAuthStore } from "@/modules/auth/stores/auth";

import AppDialog from "@/components/app/AppDialog.vue";
import AppPageTitle from "@/components/app/page/AppPageTitle.vue";
import AppPageSearch from "@/components/app/page/AppPageSearch.vue";
import AppPageButton from "@/components/app/page/AppPageButton.vue";
import AppTableDropdown from "@/components/app/AppTableDropdown.vue";

import AppFilters from "@/components/app/filters/AppFilters.vue";
import AppFiltersButton from "@/components/app/filters/AppFiltersButton.vue";
import AppFiltersChip from "@/components/app/filters/AppFiltersChip.vue";
import AppFiltersDialog from "@/components/app/filters/AppFiltersDialog.vue";
import UsersFilters from "@/modules/users/components/UsersFilters.vue";

import { useUsersList } from "@/modules/users/composables/useUsersList";
import { useUsersDelete } from "@/modules/users/composables/useUsersDelete";

import { objectIsEmpty, removeEmptyArrays } from "@/utils";

import { PAGINATION_COLUMN, ROLES } from "@/constants";
import { headers } from "@/modules/users/constants/headers";

import { type User } from "@/models";

const router = useRouter();

const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();
const { hasRole } = useRole();

const authStore = useAuthStore();

const { filters, meta, users, loading: usersListLoading, refetch } = useUsersList();
const { removeUser, loading: deleteUserLoading } = useUsersDelete();
const loading = useAsyncLoadings([usersListLoading, deleteUserLoading]);

const filtersDialog = ref(false);
const errorDialog = ref(false);
const deleteDialog = ref(false);
const deletedUser = ref<User | null>(null);
const userListFilters = ref<InstanceType<typeof UsersFilters> | null>(null);

const KRTable = useGenericTable<User, typeof headers>();
const KRTableComponent = ref<BaseTableInstance | null>(null);

const filterDisabled = computed(() => objectIsEmpty(userListFilters.value?.filters));

setBreadcrumbs([
  {
    title: "Пользователи",
    to: { name: usersList.name },
  },
]);

const getMaintainersFullName = (maintainers: User[] | null) => {
  if (!maintainers) return "-";

  const { firstname, lastname, middlename } = maintainers[0].profile;

  return `${lastname} ${firstname} ${middlename}`;
};

function submitFilters() {
  if (!userListFilters.value) return;

  const filter = removeEmptyArrays(userListFilters.value.filters);

  filters.updateFilters({ filter });
}

function resetFilters() {
  userListFilters.value?.reset();
  filters.reset();
}

function toEditPage(user: User) {
  const tableFrom: TableFrom = {
    page: filters.default.value.page,
    list: users.value.length,
  };

  void router.push({
    name: "users.update",
    params: { id: user.id },
    query: { tableFrom: JSON.stringify(tableFrom) },
  });
}

function toShowPage(user: User) {
  void router.push({ name: "users.show", params: { id: user.id } });
}

async function onDelete(user: User | null) {
  try {
    if (!user?.id) return;

    if (user.experts && user.experts.length > 0) {
      errorDialog.value = true;

      return;
    }

    await removeUser(user.id);
    refetch();
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

</script>

<template>
  <div class="container">
    <AppPageTitle title="Пользователи">
      <template #search>
        <AppPageSearch
          v-model="filters.default.value.filter.search"
          placeholder="Поиск по ФИО"
        />
      </template>
      <template #buttons>
        <AppFiltersButton
          v-if="!hasRole(ROLES.ADMIN)"
          @click="filtersDialog = true"
        />
        <AppPageButton
          v-if="authStore.isSuperAdmin"
          :to="{ name: 'users.create' }"
        >
          Добавить
        </AppPageButton>
      </template>
    </AppPageTitle>
    <AppFilters
      :filters="filters.default.value.filter"
      :keys="['roles', 'maintainers']"
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
          :value="items.maintainers"
          @remove="filters.resetExact('filter.maintainers')"
        >
          {{ getMaintainersFullName(items.maintainers) }}
        </AppFiltersChip>
      </template>
    </AppFilters>
    <KRTable
      ref="KRTableComponent"
      class="mt-6"
      :headers="headers"
      :list="users"
      :loading="loading"
      :has-actions="!loading"
      :has-actions-edit="false"
      :has-actions-show="false"
      :has-actions-delete="false"
      :params="filters.default.value"
      @update:params="filters.default.value = ($event as any)"
    >
      <template #dialog_title>
        Вы хотите удалить пользователя?
      </template>
      <template #dialog_description>
        Пользователь будет полностью удален с сайта без возможности его восстановления
      </template>
      <template #dialog_cancel>
        Отмена
      </template>
      <template #item_full_name="{ item: { profile } }">
        {{ `${profile.lastname} ${profile.firstname} ${profile.middlename ?? ''}` }}
      </template>
      <template #[`item_role.title`]="{ item: { role } }">
        <span class="text-capitalize">
          {{ role.title ?? "-" }}
        </span>
      </template>
      <template #[`item_maintainer.full_name`]="{ item: { maintainer } }">
        <span class="text-capitalize table__names">
          {{ maintainer ? getMaintainersFullName([maintainer]) : "-" }}
        </span>
      </template>
      <template #item_created_at="{ item }">
        {{ dayjs(item.created_at).format("L") }}
      </template>
      <template #item_actions_prepend="{ item }">
        <AppTableDropdown
          :hide-edit="!authStore.isSuperAdmin"
          :hide-delete="!authStore.isSuperAdmin"
          @show="toShowPage(item)"
          @edit="toEditPage(item)"
          @remove="deleteDialog = true, deletedUser = item"
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
    <AppFiltersDialog
      v-model="filtersDialog"
      :disabled="filterDisabled"
      @submit="submitFilters"
      @cancel="resetFilters"
    >
      <template #content>
        <UsersFilters
          ref="userListFilters"
          :use-filters="filters.default.value"
          :visible="filtersDialog"
        />
      </template>
    </AppFiltersDialog>
    <AppDialog
      v-model="deleteDialog"
      @submit="onDelete(deletedUser), deleteDialog = false"
    >
      <template #title>
        Вы хотите удалить пользователя?
      </template>
      <template #description>
        Пользователь будет полностью удален с сайта без возможности его восстановления
      </template>
      <template #submit>
        Удалить
      </template>
    </AppDialog>
    <VDialog
      v-model="errorDialog"
      max-width="400"
    >
      <VCard class="dialog">
        <VCardTitle class="dialog__title">
          Вы не можете удалить администратора пока за ним закреплен эксперт
        </VCardTitle>
        <VBtn
          class="dialog__close-btn"
          icon="mdi-close"
          variant="text"
          @click="errorDialog = false"
        />
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
