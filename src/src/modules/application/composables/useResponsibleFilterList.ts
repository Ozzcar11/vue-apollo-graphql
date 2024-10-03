import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import { type TableList } from "@ozzcar11/utilities/types";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import responsiblesFilterGet from "../graphql/responsibleFilter.query.gql";
import { type User } from "@/models/user";

export function useResponsiblesFilterList() {
  const query = useQuery<{ list: TableList<User> }>(responsiblesFilterGet, { per_page: UNLIMITED }, { fetchPolicy: "no-cache" });
  const responsiblesFilter = computed(() => query.result.value?.list.items || []);

  return {
    responsiblesFilter,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
