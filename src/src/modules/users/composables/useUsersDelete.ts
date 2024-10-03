import { useMutation } from "@vue/apollo-composable";
import deleteUser from "../graphql/delete.mutation.gql";

export function useUsersDelete() {
  const { mutate: remove, loading } = useMutation<{ usersDelete: boolean }, { id: number }>(deleteUser);

  return {
    loading,
    removeUser: (id: number) => remove({ id }),
  };
}
