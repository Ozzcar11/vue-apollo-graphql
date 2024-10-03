import { useMutation } from "@vue/apollo-composable";
import update from "../graphql/update.mutation.gql";
import { type STATUS_VALUE_TYPE } from "../constants";
import { type Application } from "@/models";

export type ApplicationUpdateType = {
  id: number;
  status: STATUS_VALUE_TYPE;
};

export const useApplicationUpdate = () => {
  const { mutate: updateApplication, loading, onError } = useMutation<{ applicationUpdate: Application }, { userApplication: ApplicationUpdateType }>(update);

  return {
    updateApplication,
    onError,
    loading,
  };
};
