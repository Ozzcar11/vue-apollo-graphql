<script setup lang="ts">
import { computed, ref, unref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { type Nullable } from "@ozzcar11/utilities/types";
import { minValue } from "@ozzcar11/utilities/validators";
import {
  VAutocomplete,
  VCol,
  VRow,
  VSelect,
  VTextField,
} from "vuetify/components";
import { type CompaniesListFilters } from "../composables/useCompaniesList";
import { type CompanyCategory, type Region } from "@/models";

import { useRegionsList } from "@/modules/regions/composables/useRegionList";
import { useCompanyCategoriesList } from "@/modules/companies/composables/useCompanyCategories";

import { APPLICATION_STATUS_TITLE, type STATUS_VALUE_TYPE } from "@/modules/application/constants";

type Props = {
  useFilters: CompaniesListFilters;
  visible: boolean;
};

export type Filters = Nullable<{
  region_registration: Region;
  average_headcount_from: number;
  average_headcount_to: number;
  revenue_year_from: number;
  revenue_year_to: number;
  company_category: CompanyCategory;
  status: STATUS_VALUE_TYPE;
  result_from: number;
  result_to: number;
}>;

const props = defineProps<Props>();

const { regions } = useRegionsList();
const { companyCategories } = useCompanyCategoriesList();

const filters = ref<Filters>({
  region_registration: null,
  average_headcount_from: null,
  average_headcount_to: null,
  revenue_year_from: null,
  revenue_year_to: null,
  company_category: null,
  status: null,
  result_from: null,
  result_to: null,
});

const rules = computed(() => ({
  average_headcount_from: { minValue: minValue(0) },
  average_headcount_to: { minValue: minValue(0) },
  revenue_year_from: { minValue: minValue(0) },
  revenue_year_to: { minValue: minValue(0) },
  result_from: { minValue: minValue(0) },
  result_to: { minValue: minValue(0) },
}));

const v = useVuelidate(rules, filters.value);

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
  <VAutocomplete
    v-model="filters.region_registration"
    label="Регион регистрации"
    :items="regions"
    :item-title="(item: Region) => item.name"
    class="mb-4"
    return-object
    hide-details
  />
  <VRow>
    <VCol
      cols="12"
      md="6"
      class="pb-0"
    >
      <VTextField
        v-model="filters.result_from"
        type="number"
        label="Итоговый балл от"
        placeholder="Введите балл"
        :error-messages="v.result_from.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.result_from.$dirty || !v.result_from.$invalid"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
      class="pb-0"
    >
      <VTextField
        v-model="filters.result_to"
        type="number"
        label="Итоговый балл до"
        placeholder="Введите балл"
        :error-messages="v.result_to.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.result_to.$dirty || !v.result_to.$invalid"
      />
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="6"
      class="pb-0"
    >
      <VTextField
        v-model="filters.average_headcount_from"
        type="number"
        label="Среднесписочная численность от"
        placeholder="Введите численность"
        :error-messages="v.average_headcount_from.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.average_headcount_from.$dirty || !v.average_headcount_from.$invalid"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
      class="pb-0"
    >
      <VTextField
        v-model="filters.average_headcount_to"
        type="number"
        label="Среднесписочная численность до"
        :error-messages="v.average_headcount_to.$errors.map((e) => unref(e.$message))"
        placeholder="Введите численность"
        :hide-details="!v.average_headcount_to.$dirty || !v.average_headcount_to.$invalid"
      />
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="filters.revenue_year_from"
        type="number"
        label="Выручка за предыдущий год от"
        placeholder="Введите выручку"
        :error-messages="v.revenue_year_from.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.revenue_year_from.$dirty || !v.revenue_year_from.$invalid"
        class="mb-4"
      />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <VTextField
        v-model="filters.revenue_year_to"
        type="number"
        label="Выручка за предыдущий год до"
        placeholder="Введите выручку"
        :error-messages="v.revenue_year_to.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.revenue_year_to.$dirty || !v.revenue_year_to.$invalid"
        class="mb-4"
      />
    </VCol>
  </VRow>
  <VSelect
    v-model="filters.status"
    class="mb-4"
    label="Анкетирование"
    :items="Object.entries(APPLICATION_STATUS_TITLE)"
    :item-title="(item: string[]) => item[1]"
    :item-value="(item: string[]) => item[0]"
    hide-details
  />
  <VSelect
    v-model="filters.company_category"
    class="mb-4"
    label="Категория"
    :items="companyCategories"
    :item-title="(item: CompanyCategory) => item.name"
    return-object
    hide-details
  />
</template>
