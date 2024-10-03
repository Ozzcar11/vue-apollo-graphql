import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { type Application } from "@/models";

export function useApplicationGet(id: number) {
  const query = useQuery<{ userApplication: Application }>(get, { id }, { fetchPolicy: "no-cache" });
  const application = computed(() => query.result.value?.userApplication || null);

  return {
    application,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
