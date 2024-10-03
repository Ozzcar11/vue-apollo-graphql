import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { useAsyncFn, useAsyncLoadings, useFilters, useGqlLoading } from "@ozzcar11/utilities/composables";
import { type TableList } from "@ozzcar11/utilities/types";
import list from "../graphql/list.query.gql";
import { type Role } from "@/models/role";

export function useRolesList() {
  const filters = useFilters({
    limit: UNLIMITED,
  });

  const query = useQuery<{ roles: TableList<Role> }>(list, filters.default);

  const roles = computed(() => query.result.value?.roles.items || []);
  const { request: refetch, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    filters,
    roles,
    refetch,
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
    onResult: query.onResult,
  };
}
