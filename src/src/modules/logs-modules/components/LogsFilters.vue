<script setup lang="ts">
import { computed, ref } from "vue";
import { VSelect } from "vuetify/components";
import { BaseDatePicker } from "@ozzcar11/components";
import { type Nullable, type ValueOf } from "@ozzcar11/utilities/types";
import { type LogsListFilters } from "../composables/useLogsList";
import { type Role } from "@/models";

import { useRolesList } from "@/modules/roles/composables/useRolesList";
import { ACTIONS, ACTIONS_TITLE, DATE_FORMATS, ROLES } from "@/constants";
import { APPLICATION_STATUS, APPLICATION_STATUS_ACTION, APPLICATION_STATUS_TITLE } from "@/modules/application/constants/status";

type Props = {
  useFilters: LogsListFilters;
  visible: boolean;
};

type Filters = Nullable<{
  roles: Role[];
  action_filter: ValueOf<typeof ACTIONS>;
  action_date_from: string;
  action_date_to: string;
}>;

type ActionsTypesType = {
  title: string;
  value: ValueOf<typeof ACTIONS> | ValueOf<typeof APPLICATION_STATUS_TITLE>;
};

const props = defineProps<Props>();

const { roles: rolesList, loading } = useRolesList();

const filters = ref<Filters>({
  roles: null,
  action_filter: null,
  action_date_from: null,
  action_date_to: null,
});

const dateValue = computed({
  get() {
    const { action_date_from: actionDateFrom, action_date_to: actionDateTo } = filters.value;

    if (!actionDateFrom) return [];
    if (!actionDateTo) return [actionDateFrom];

    return [actionDateFrom, actionDateTo];
  },
  set(value) {
    filters.value.action_date_from = value[0];
    filters.value.action_date_to = value[1];
  },
});

const actionsTypes: ActionsTypesType[] = [
  {
    title: ACTIONS_TITLE[ACTIONS.user_create],
    value: ACTIONS.user_create,
  },
  {
    title: ACTIONS_TITLE[ACTIONS.user_update],
    value: ACTIONS.user_update,
  },
  {
    title: ACTIONS_TITLE[ACTIONS.user_delete],
    value: ACTIONS.user_delete,
  },
  {
    title: ACTIONS_TITLE[ACTIONS.partner_offer_create],
    value: ACTIONS.partner_offer_create,
  },
  {
    title: ACTIONS_TITLE[ACTIONS.partner_offer_update],
    value: ACTIONS.partner_offer_update,
  },
  {
    title: ACTIONS_TITLE[ACTIONS.partner_offer_delete],
    value: ACTIONS.partner_offer_delete,
  },
  {
    title: APPLICATION_STATUS_ACTION[APPLICATION_STATUS.IN_WORK],
    value: ACTIONS.user_application_proceede,
  },
  {
    title: APPLICATION_STATUS_ACTION[APPLICATION_STATUS.PROCESSED],
    value: ACTIONS.user_application_finish,
  },
];

const allowedRoles = [ROLES.ADMIN, ROLES.EXPERT, ROLES.SUPERADMIN];
const filtersRolesValue = computed(() => {
  return rolesList.value.filter(role => allowedRoles.includes(role.name));
});

function updateValues() {
  Object.assign(filters.value, props.useFilters.filter);
}

function reset() {
  for (const key in filters.value) {
    filters.value[key as keyof Filters] = null;
  }
}

updateValues();

defineExpose({
  filters,
  reset,
});
</script>

<template>
  <VSelect
    v-model="filters.action_filter"
    class="mb-4"
    label="Совершенное действие"
    :items="actionsTypes"
    :item-title="(item: ActionsTypesType) => item.title"
    :loading="loading"
    hide-details
  />
  <VSelect
    v-model="filters.roles"
    class="mb-4"
    label="Роль"
    :items="filtersRolesValue"
    :item-title="(item: Role) => item.title"
    :item-value="(item: Role) => ([item])"
    hide-details
  />
  <BaseDatePicker
    v-model="dateValue"
    :model-format="DATE_FORMATS.BASE"
    :output-format="DATE_FORMATS.OUTPUT"
    :readable-format="DATE_FORMATS.READABLE"
    :mask="DATE_FORMATS.MASK"
    :input="{
      hideDetails: true,
      label: 'Дата изменения',
      placeholder: 'Введите даты (от - до)'
    }"
  />
</template>
