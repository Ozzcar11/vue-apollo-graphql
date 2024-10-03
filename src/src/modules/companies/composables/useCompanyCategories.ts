import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useAsyncFn, useAsyncLoadings, useGqlLoading } from "@ozzcar11/utilities/composables";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { type TableList } from "@ozzcar11/utilities/types";
import categories from "../graphql/categories.query.gql";
import { type CompanyCategory } from "@/models";

export function useCompanyCategoriesList() {
  const query = useQuery<{ list: TableList<CompanyCategory> }>(categories, { limit: UNLIMITED });

  const companyCategories = computed(() => query.result.value?.list.items || []);
  const { request: refetch, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    companyCategories,
    refetch,
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
  };
}
