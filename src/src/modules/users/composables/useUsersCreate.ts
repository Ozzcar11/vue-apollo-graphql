import { useMutation } from "@vue/apollo-composable";
import create from "../graphql/create.mutation.gql";
import { type User, type UsersProps } from "@/models";

export const useUsersCreate = () => {
  const { mutate: createUser, loading, onError } = useMutation<{ user: User }, { user: UsersProps }>(create);

  return {
    createUser,
    onError,
    loading,
  };
};
