import { useMutation } from "@vue/apollo-composable";
import create from "../graphql/create.mutation.gql";
import { type Partner, type PartnersProps } from "@/models";

export const usePartnersCreate = () => {
  const { mutate: createPartner, loading, onError } = useMutation<{ partnerOffersCreate: Partner }, { partnerOffer: PartnersProps }>(create);

  return {
    createPartner,
    onError,
    loading,
  };
};
