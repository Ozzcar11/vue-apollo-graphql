import { type ApolloError } from "@apollo/client";
import { GRAPHQL_TAKEN_EMAIL_ERROR } from "@/constants/errors";

export const emailTaken = (error: ApolloError) => {
  return (error.graphQLErrors[0].extensions?.validation as { [key: string]: string[] })?.["user.email"].includes(GRAPHQL_TAKEN_EMAIL_ERROR);
};
