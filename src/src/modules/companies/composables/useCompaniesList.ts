import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  useAsyncFn,
  useAsyncLoadings,
  useFilters,
  useGqlLoading,
  useMeta,
} from "@ozzcar11/utilities/composables";
import { type TableFilters, type TableList } from "@ozzcar11/utilities/types";
import { TABLE_SORT_DIRECTIONS } from "@ozzcar11/utilities/constants";
import list from "../graphql/list.query.gql";
import { headers } from "../constants/headers";
import { type Company, type CompanyCategory, type Region } from "@/models";
import { type STATUS_VALUE_TYPE } from "@/modules/application/constants/status";

export type CompaniesListFilters = TableFilters<{
  search?: string;
  status: STATUS_VALUE_TYPE | null;
  region_registration: Region | null;
  company_category: CompanyCategory | null;
  average_headcount_from: string | null;
  average_headcount_to: string | null;
  revenue_year_from: string | null;
  revenue_year_to: string | null;
  result_from: string | null;
  result_to: string | null;
}>;

export function useCompaniesList() {
  const filters = useFilters<CompaniesListFilters>({
    filter: {
      search: undefined,
      status: null,
      region_registration: null,
      company_category: null,
      average_headcount_from: null,
      average_headcount_to: null,
      revenue_year_from: null,
      revenue_year_to: null,
      result_from: null,
      result_to: null,
    },
    sort: {
      column: headers[0].value,
      direction: TABLE_SORT_DIRECTIONS.ASC,
    },
  });

  const query = useQuery<{ list: TableList<Company> }>(list, filters.default);
  const meta = useMeta(query, filters);

  const companies = computed(() => query.result.value?.list.items || []);
  const { request: refetchQuery, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    meta,
    companies,
    refetch: (onDelete = false) => {
      if (onDelete === true && companies.value.length === 1) {
        filters.fixCurrentPage();

        return;
      }

      void refetchQuery();
    },
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
