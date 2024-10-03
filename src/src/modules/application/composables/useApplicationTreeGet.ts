import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import applicationTreeGet from "../graphql/applicationTree.query.gql";
import { type STATUS_VALUE_TYPE } from "../constants";
import { type Area } from "@/models";

export type ApplicationTreeFilters = {
  user_application: {
    id: number;
    status?: STATUS_VALUE_TYPE;
  };
};

export function useApplicationTreeGet(filter: ApplicationTreeFilters) {
  const query = useQuery<{ applicationAreasTree: Area[] }>(applicationTreeGet, { filter });
  const applicationTree = computed(() => query.result.value?.applicationAreasTree || null);

  return {
    applicationTree,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
