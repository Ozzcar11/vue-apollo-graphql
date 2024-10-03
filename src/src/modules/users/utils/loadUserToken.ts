import { useApolloClient } from "@vue/apollo-composable";
import { useNotifications } from "@ozzcar11/utilities/composables";
import inviteOrReset from "@/modules/users/graphql/inviteOrReset.mutation.gql";

const { notificate } = useNotifications();

type inviteOrResetType = {
  token: string;
  status: boolean;
};

export async function loadUserInvite(id: number) {
  const { client } = useApolloClient();

  try {
    return await client.query<{ inviteOrReset: inviteOrResetType }>({
      query: inviteOrReset,
      variables: {
        inviteOrReset: {
          company_id: id,
        },
      },
      fetchPolicy: "no-cache",
    });
  } catch (e) {
    console.error(e);
    notificate("Произошла неизвестная ошибка", { type: "error" });
  }
}
