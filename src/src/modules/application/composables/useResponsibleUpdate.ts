import { useMutation } from "@vue/apollo-composable";
import responsibleUpdate from "../graphql/responsibleUpdate.mutation.gql";
import { type User } from "@/models/user";

export type ResponsibleUpdateType = {
  user_application: {
    id: number;
  };
  user: User | null;
};

export const useResponsibleUpdate = () => {
  const { mutate: updateResponsible, loading, onError } = useMutation<{ responsibleUpdate: ResponsibleUpdateType }, { userApplicationResponsible: ResponsibleUpdateType }>(responsibleUpdate);

  return {
    updateResponsible,
    onError,
    loading,
  };
};
