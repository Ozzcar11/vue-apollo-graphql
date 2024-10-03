import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  useAsyncFn,
  useAsyncLoadings,
  useFilters,
  useGqlLoading,
  useMeta,
} from "@ozzcar11/utilities/composables";
import { type TableFilters, type TableList, type ValueOf } from "@ozzcar11/utilities/types";
import { TABLE_SORT_DIRECTIONS } from "@ozzcar11/utilities/constants";
import list from "../graphql/list.query.gql";
import { type Log, type Role } from "@/models";
import { ACTIONS } from "@/constants";

export type LogsListFilters = TableFilters<{
  search: string;
  roles: Role[] | null;
  action_date: string | null;
  action_filter: ValueOf<typeof ACTIONS> | null;
  action_date_from: string | null;
  action_date_to: string | null;
}>;

export function useLogsList() {
  const filters = useFilters<LogsListFilters>({
    filter: {
      search: "",
      roles: null,
      action_date: null,
      action_filter: null,
      action_date_from: null,
      action_date_to: null,
    },
    sort: {
      column: "id",
      direction: TABLE_SORT_DIRECTIONS.DESC,
    },
  });

  const query = useQuery<{ list: TableList<Log> }>(list, filters.default, { fetchPolicy: "no-cache" });
  const meta = useMeta(query, filters);

  const logs = computed(() => query.result.value?.list.items || []);
  const { request: refetchQuery, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    meta,
    logs,
    refetch: (onDelete = false) => {
      if (onDelete === true && logs.value.length === 1) {
        filters.fixCurrentPage();

        return;
      }

      void refetchQuery();
    },
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
