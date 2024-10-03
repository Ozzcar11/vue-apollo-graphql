<script setup lang="ts">
import { ref } from "vue";

import { type BaseTableInstance, BaseTablePagination, useGenericTable } from "@ozzcar11/components";
import { type TableFrom } from "@ozzcar11/utilities/types";

import { useRouter } from "vue-router";

import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { dayjs } from "@ozzcar11/utilities/plugins";
import { useAuthStore } from "@/modules/auth/stores/auth";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

import AppDialog from "@/components/app/AppDialog.vue";
import AppPageTitle from "@/components/app/page/AppPageTitle.vue";
import AppPageSearch from "@/components/app/page/AppPageSearch.vue";
import AppPageButton from "@/components/app/page/AppPageButton.vue";
import AppTableDropdown from "@/components/app/AppTableDropdown.vue";

import { usePartnersList } from "@/modules/partners/composables/usePartnersList";
import { usePartnersDelete } from "@/modules/partners/composables/usePartnersDelete";

import { partnersCreate, partnersList, partnersUpdate } from "@/router/routes/partners";

import { headers } from "@/modules/partners/constants/headers";
import { PAGINATION_COLUMN } from "@/constants";

import { type Partner } from "@/models";

const router = useRouter();
const authStore = useAuthStore();

const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();

const { filters, meta, partners, loading: partnersListLoading, refetch } = usePartnersList();
const { removePartner, loading: deletePartnerLoading } = usePartnersDelete();
const loading = useAsyncLoadings([partnersListLoading, deletePartnerLoading]);

const KRTable = useGenericTable<Required<Partner>, typeof headers>();
const KRTableComponent = ref<BaseTableInstance | null>(null);

const deleteDialog = ref(false);
const deletedPartner = ref<Partner | null>(null);

setBreadcrumbs([
  {
    title: "Предложения от партнеров",
    to: { name: partnersList.name },
  },
]);

function toEditPage(partner: Partner) {
  const tableFrom: TableFrom = {
    page: filters.default.value.page,
    list: partners.value.length,
  };

  void router.push({
    name: partnersUpdate.name,
    params: { id: partner.id },
    query: { tableFrom: JSON.stringify(tableFrom) },
  });
}

async function onDelete(partner: Partner | null) {
  if (!partner) return;

  try {
    if (!partner.id) return;
    await removePartner(partner.id);
    refetch(true);
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

</script>

<template>
  <div class="container">
    <AppPageTitle title="Предложения от партнеров">
      <template #search>
        <AppPageSearch
          v-model="filters.default.value.filter.search"
          placeholder="Поиск по наименованию"
        />
      </template>
      <template #buttons>
        <AppPageButton
          v-if="authStore.isSuperAdmin"
          :to="{ name: partnersCreate.name }"
        >
          Добавить
        </AppPageButton>
      </template>
    </AppPageTitle>
    <KRTable
      ref="KRTableComponent"
      class="mt-6"
      :headers="headers"
      :list="partners"
      :loading="loading"
      :has-actions="!loading"
      :has-actions-edit="false"
      :has-actions-show="false"
      :has-actions-delete="false"
      :params="filters.default.value"
      @update:params="filters.default.value = ($event as any)"
    >
      <template #dialog_title>
        Удалить предложение?
      </template>
      <template #dialog_description>
        Вы действительно хотите удалить предложение партнера?
      </template>
      <template #item_link="{ item }">
        <a
          class="text-primary text-decoration-none"
          :href="item.link"
          target="_blank"
        >{{ item.link }}</a>
      </template>
      <template #item_actions_prepend="{ item }">
        <AppTableDropdown
          :hide-show="authStore.isSuperAdmin"
          :hide-edit="!authStore.isSuperAdmin"
          :hide-delete="!authStore.isSuperAdmin"
          @edit="toEditPage(item)"
          @remove="deleteDialog = true, deletedPartner = item"
          @show="toEditPage(item)"
        />
      </template>
      <template #item_created_at="{ item }">
        {{ dayjs(item.created_at).format("L") }}
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
    <AppDialog
      v-model="deleteDialog"
      @submit="onDelete(deletedPartner), deleteDialog = false"
    >
      <template #title>
        Удалить предложение?
      </template>
      <template #description>
        Вы действительно хотите удалить предложение партнера?
      </template>
      <template #submit>
        Удалить
      </template>
    </AppDialog>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__names {
    white-space: pre-wrap;
  }
}
</style>
