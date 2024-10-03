import { useMutation } from "@vue/apollo-composable";
import logout from "../graphql/logout.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export const useLogout = () => {
  const { mutate: logoutRequest, onError } = useMutation(logout, { clientId: APOLLO_CLIENTS.public });

  return {
    logoutRequest,
    onError,
  };
};
