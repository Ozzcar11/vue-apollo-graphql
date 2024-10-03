import { useApolloClient } from "@vue/apollo-composable";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import UsersList from "@/modules/users/graphql/list.query.gql";

import { type Role, type User } from "@/models";

type UsersQuery = {
  list: {
    items: User[];
  };
};

export async function loadUsers(role: Role) {
  const { client } = useApolloClient();

  return await client.query<UsersQuery>({
    query: UsersList,
    variables: {
      per_page: UNLIMITED,
      filter: {
        roles: [role],
      },
    },
    fetchPolicy: "no-cache",
  });
}
