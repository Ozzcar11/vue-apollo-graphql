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
import { type Partner } from "@/models";

export type PartnersListFilters = TableFilters<{
  search: string;
}>;

export function usePartnersList() {
  const filters = useFilters<PartnersListFilters>({
    filter: {
      search: "",
    },
    sort: {
      column: headers[0].value,
      direction: TABLE_SORT_DIRECTIONS.ASC,
    },
  });

  const query = useQuery<{ list: TableList<Partner> }>(list, filters.default);
  const meta = useMeta(query, filters);

  const partners = computed(() => query.result.value?.list.items || []);
  const { request: refetchQuery, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    meta,
    partners,
    refetch: (onDelete = false) => {
      if (onDelete === true && partners.value.length === 1) {
        filters.fixCurrentPage();

        return;
      }

      void refetchQuery();
    },
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
