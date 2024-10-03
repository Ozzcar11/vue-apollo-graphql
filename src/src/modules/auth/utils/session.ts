import { GRAPHQL_ERROR_MESSAGES } from "@ozzcar11/utilities/constants";
import { useMe } from "../composables/useMe";

const { loadMe } = useMe();

export async function getUserSession() {
  try {
    const result = await loadMe();
    if (!result.data) throw new Error(GRAPHQL_ERROR_MESSAGES.unauthenticated);

    return result.data.me;
  } catch (error) {
    console.error(error);

    return false;
  }
}
