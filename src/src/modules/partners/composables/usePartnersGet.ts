import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { type Partner } from "@/models";

export function usePartnersGet(id: number) {
  const query = useQuery<{ partnerOffer: Partner }>(get, { id });
  const partner = computed(() => query.result.value?.partnerOffer || null);

  return {
    partner,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}
