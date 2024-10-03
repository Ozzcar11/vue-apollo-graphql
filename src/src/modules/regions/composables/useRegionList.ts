import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useAsyncFn, useAsyncLoadings, useGqlLoading } from "@ozzcar11/utilities/composables";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { type TableList } from "@ozzcar11/utilities/types";
import list from "../graphql/list.query.gql";
import { type Region } from "@/models/region";

export function useRegionsList() {
  const query = useQuery<{ list: TableList<Region> }>(list, { limit: UNLIMITED });

  const regions = computed(() => query.result.value?.list.items || []);
  const { request: refetch, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    regions,
    refetch,
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
  };
}
