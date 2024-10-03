import {
  makeApolloClient,
  makeAuthLink,
  makeErrorLink,
  makeMiddlewareLink,
  makeUploadLink,
} from "@ozzcar11/utilities/plugins";
import { onError } from "./error";
import { API_DOMAIN } from "@/constants";

const authLink = makeAuthLink(API_DOMAIN, {
  "Apollo-Require-Preflight": "true",
});
const errorLink = makeErrorLink();
const middlewareLink = makeMiddlewareLink();
const uploadLink = makeUploadLink(API_DOMAIN, "graphql/admin");

export const uploadApolloClient = makeApolloClient({
  domain: API_DOMAIN,
  path: "graphql/admin",
  links: [middlewareLink, errorLink, authLink, uploadLink],
  connectToDevTools: import.meta.env.DEV,
  onError,
});
