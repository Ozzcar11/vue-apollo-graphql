import { type GraphQLErrors } from "@apollo/client/errors";
import { GRAPHQL_ERROR_MESSAGES } from "@ozzcar11/utilities/constants";
import { useNotifications } from "@ozzcar11/utilities/composables";
import { router } from "@/router";

const { notificate } = useNotifications();

export function onError(error: GraphQLErrors[0]) {
  if (error.message === GRAPHQL_ERROR_MESSAGES.unauthenticated) {
    void router.push({ name: "login" });
  }
  const debugMessage = error.extensions?.debugMessage as string;
  if (debugMessage && debugMessage.includes("No query results for model")) {
    notificate("Данной сущности не существует", { type: "error" });
    void router.push({ name: "logs" });
  }
}
