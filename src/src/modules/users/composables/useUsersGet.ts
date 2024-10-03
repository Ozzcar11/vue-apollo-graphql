import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { type User } from "@/models/user";

export function useUsersGet(id: number) {
  const query = useQuery<{ user: User }>(get, { id });
  const user = computed(() => query.result.value?.user || null);

  return {
    user,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
