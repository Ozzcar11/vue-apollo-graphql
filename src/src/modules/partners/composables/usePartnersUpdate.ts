import { useMutation } from "@vue/apollo-composable";
import update from "../graphql/update.mutation.gql";
import { type Partner, type PartnersProps } from "@/models";

export const usePartnersUpdate = () => {
  const { mutate: updatePartner, loading, onError } = useMutation<{ partnerOffersUpdate: Partner }, { partnerOffer: PartnersProps }>(update);

  return {
    updatePartner,
    onError,
    loading,
  };
};
