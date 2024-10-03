import { useMutation } from "@vue/apollo-composable";
import login from "../graphql/login.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { type User } from "@/models/user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  login: {
    user: User;
  };
};

export const useLogin = () => {
  const { mutate: loginRequest, loading, onError } = useMutation<LoginResponse, LoginRequest>(login, {
    clientId: APOLLO_CLIENTS.public,
  });

  return {
    loginRequest,
    onError,
    loading,
  };
};
