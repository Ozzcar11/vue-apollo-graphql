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
import { type STATUS_VALUE_TYPE, headers } from "../constants";
import { type Application, type User } from "@/models";

export type ApplicationListFilters = TableFilters<{
  search: string;
  responsible: User | null;
  status: STATUS_VALUE_TYPE | null;
  date: string | null;
}>;

export function useApplicationList() {
  const filters = useFilters<ApplicationListFilters>({
    filter: {
      search: "",
      responsible: null,
      status: null,
      date: null,
    },
    sort: {
      column: headers[0].value,
      direction: TABLE_SORT_DIRECTIONS.ASC,
    },
  });

  const query = useQuery<{ list: TableList<Application> }>(list, filters.default);
  const meta = useMeta(query, filters);

  const applications = computed(() => query.result.value?.list.items || []);
  const { request: refetchQuery, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    meta,
    applications,
    refetch: (onDelete = false) => {
      if (onDelete === true && applications.value.length === 1) {
        filters.fixCurrentPage();

        return;
      }

      void refetchQuery();
    },
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
