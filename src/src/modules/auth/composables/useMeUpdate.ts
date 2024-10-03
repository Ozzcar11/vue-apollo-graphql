import { useMutation } from "@vue/apollo-composable";
import update from "../graphql/update.mutation.gql";
import { type User, type UsersProps } from "@/models/user";

export const useMeUpdate = () => {
  const { mutate: meUpdate, loading, onError } = useMutation<{ meUpdate: User }, { user: UsersProps }>(update);

  return {
    meUpdate,
    onError,
    loading,
  };
};
