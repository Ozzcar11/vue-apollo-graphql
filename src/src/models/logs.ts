import { type ValueOf } from "@ozzcar11/utilities/types";
import { type Partner, type User } from ".";
import { ACTIONS_TYPENAME, ACTIONS_TYPE_CRUD } from "@/constants";
import { APPLICATION_STATUS_ACTION } from "@/modules/application/constants/status";

export type Log = {
  id: number;
  action_type: ValueOf<typeof ACTIONS_TYPE_CRUD>;
  action_date: string;
  data_after: {
    id?: number;
    __typename?: ValueOf<typeof ACTIONS_TYPENAME>;
    status?: keyof typeof APPLICATION_STATUS_ACTION;
  } & (User | Partner);
  data_before: {
    id?: number;
    __typename?: ValueOf<typeof ACTIONS_TYPENAME>;
    status?: keyof typeof APPLICATION_STATUS_ACTION;
  };
  user: User;
};
