<script setup lang="ts">
import { ref } from "vue";
import { VSelect } from "vuetify/components";
import { BaseDatePicker } from "@ozzcar11/components";
import { type Nullable } from "@ozzcar11/utilities/types";
import { type ApplicationListFilters } from "../composables/useApplicationList";
import { useResponsiblesFilterList } from "../composables/useResponsibleFilterList";
import { type User } from "@/models";
import { DATE_FORMATS } from "@/constants";
import { APPLICATION_STATUS_TITLE, type STATUS_VALUE_TYPE } from "@/modules/application/constants/status";
import { getFullName } from "@/modules/users/utils/getFullName";

type Props = {
  useFilters: ApplicationListFilters;
  visible: boolean;
};

type Filters = Nullable<{
  responsible: User | null;
  status: STATUS_VALUE_TYPE | null;
  date: string | null;
}>;

const props = defineProps<Props>();

const filters = ref<Filters>({
  responsible: null,
  status: null,
  date: null,
});

const { responsiblesFilter } = useResponsiblesFilterList();

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
    v-model="filters.responsible"
    class="mb-4"
    label="Проверяющий"
    :items="responsiblesFilter"
    :item-title="(item: User) => getFullName(item.profile)"
    return-object
    hide-details
  />
  <VSelect
    v-model="filters.status"
    class="mb-4"
    label="Статус"
    :items="Object.entries(APPLICATION_STATUS_TITLE)"
    :item-title="(item: string[]) => item[1]"
    :item-value="(item: string[]) => item[0]"
    hide-details
  />
  <BaseDatePicker
    v-model="filters.date"
    :model-format="DATE_FORMATS.BASE"
    :output-format="DATE_FORMATS.OUTPUT"
    :readable-format="DATE_FORMATS.READABLE"
    :mask="DATE_FORMATS.MASK"
    :input="{
      hideDetails: true,
      label: 'Дата отправки анкеты',
      placeholder: 'Введите дату',
    }"
  />
</template>
