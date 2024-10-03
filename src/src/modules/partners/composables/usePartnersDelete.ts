import { useMutation } from "@vue/apollo-composable";
import deletePartner from "../graphql/delete.mutation.gql";

export function usePartnersDelete() {
  const { mutate: remove, loading } = useMutation<{ partnerOffersDelete: boolean }, { id: number }>(deletePartner);

  return {
    loading,
    removePartner: (id: number) => remove({ id }),
  };
}
