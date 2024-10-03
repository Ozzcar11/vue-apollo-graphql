import { provideApolloClients, useApolloClient } from "@vue/apollo-composable";
import meQuery from "../graphql/me.guery.gql";
import { type User } from "@/models/user";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { adminApolloClient, publicApolloClient } from "@/plugins/apollo";

export function useMe() {
  provideApolloClients({
    [APOLLO_CLIENTS.admin]: adminApolloClient,
    [APOLLO_CLIENTS.public]: publicApolloClient,
  });

  const { client } = useApolloClient();
  const loadMe = async () => {
    return await client.query<{ me: User }>({ query: meQuery, fetchPolicy: "no-cache" });
  };

  return {
    loadMe,
  };
}
