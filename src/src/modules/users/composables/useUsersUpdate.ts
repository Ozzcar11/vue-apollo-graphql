import { useMutation } from "@vue/apollo-composable";
import update from "../graphql/update.mutation.gql";
import { type User, type UsersProps } from "@/models/user";

export const useUsersUpdate = () => {
  const { mutate: updateUser, loading, onError } = useMutation<{ usersUpdate: User }, { user: UsersProps }>(update);

  return {
    updateUser,
    onError,
    loading,
  };
};
