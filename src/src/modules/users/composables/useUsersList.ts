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
import { type Role, type User } from "@/models";

export type UsersListFilters = TableFilters<{
  search: string;
  roles: Role[] | null;
  maintainers: User[] | null;
}>;

export function useUsersList() {
  const filters = useFilters<UsersListFilters>({
    filter: {
      search: "",
      roles: null,
      maintainers: null,
    },
    sort: {
      column: headers[2].value,
      direction: TABLE_SORT_DIRECTIONS.ASC,
    },
  });

  const query = useQuery<{ list: TableList<User> }>(list, filters.default, {
    fetchPolicy: "no-cache",
  });
  const meta = useMeta(query, filters);

  const users = computed(() => query.result.value?.list.items || []);
  const { request: refetchQuery, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    meta,
    users,
    refetch: (onDelete = false) => {
      if (onDelete === true && users.value.length === 1) {
        filters.fixCurrentPage();

        return;
      }

      void refetchQuery();
    },
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
