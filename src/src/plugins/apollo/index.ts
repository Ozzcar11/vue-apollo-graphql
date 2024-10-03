import { type Plugin } from "vue";
import { ApolloClients } from "@vue/apollo-composable";
import { makeApolloClient } from "@ozzcar11/utilities/plugins";
import { uploadApolloClient } from "./upload";
import { onError } from "./error";
import { API_DOMAIN, APOLLO_CLIENTS } from "@/constants";

export const publicApolloClient = makeApolloClient({
  domain: API_DOMAIN,
  path: "graphql/public",
  queryFetchPolicy: "no-cache",
  connectToDevTools: import.meta.env.DEV,
  onError,
});

export const adminApolloClient = makeApolloClient({
  domain: API_DOMAIN,
  path: "graphql/admin",
  connectToDevTools: import.meta.env.DEV,
  onError,
});

export const apollo: Plugin = {
  install(app) {
    app.provide(ApolloClients, {
      [APOLLO_CLIENTS.public]: publicApolloClient,
      [APOLLO_CLIENTS.admin]: adminApolloClient,
      [APOLLO_CLIENTS.upload]: uploadApolloClient,
    });
  },
};
