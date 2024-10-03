import { useApolloClient } from "@vue/apollo-composable";
import getStatus from "../graphql/importProcessing.query.gql";
import { type ImportProcessing } from "@/models";

export function loadImportStatus() {
  const { client } = useApolloClient();

  const loadImportProcess = async () => {
    return await client.query<{ importProcessings: ImportProcessing | null }>({ query: getStatus, fetchPolicy: "no-cache" });
  };

  return {
    loadImportProcess,
  };
}
