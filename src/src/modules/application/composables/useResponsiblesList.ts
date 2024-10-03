import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import { type TableList } from "@ozzcar11/utilities/types";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import responsiblesGet from "../graphql/responsibles.query.gql";
import { type User } from "@/models/user";

export function useResponsiblesList() {
  const query = useQuery<{ list: TableList<User> }>(responsiblesGet, { per_page: UNLIMITED }, { fetchPolicy: "no-cache" });
  const responsibles = computed(() => query.result.value?.list.items || []);

  return {
    responsibles,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
