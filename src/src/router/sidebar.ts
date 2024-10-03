import { usersCreate, usersList, usersUpdate } from "./routes/users";
import { partnersCreate, partnersList, partnersUpdate } from "./routes/partners";
import { profileList } from "./routes/profile";
import { logsList } from "./routes/logs";
import { companiesList } from "./routes/companies";
import { applicationAbout, applicationEcology, applicationList } from "./routes/application";
import { ROLES } from "@/constants/roles";

export const SidebarRoutes = {
  [ROLES.SUPERADMIN]: [
    {
      ...usersList,
      children: [
        usersCreate,
        usersUpdate,
      ],
    },
    companiesList,
    {
      ...applicationList,
      children: [
        applicationAbout,
        applicationEcology,
      ],
    },
    logsList,
    {
      ...partnersList,
      children: [
        partnersCreate,
        partnersUpdate,
      ],
    },
    profileList,
  ],
  [ROLES.ADMIN]: [
    usersList,
    {
      ...applicationList,
      children: [
        applicationAbout,
        applicationEcology,
      ],
    },
    profileList,
  ],
  [ROLES.EXPERT]: [
    {
      ...applicationList,
      children: [
        applicationAbout,
        applicationEcology,
      ],
    },
    profileList,
  ],
  [ROLES.WATCHER]: [
    usersList,
    companiesList,
    {
      ...applicationList,
      children: [
        applicationAbout,
        applicationEcology,
      ],
    },
    logsList,
    {
      ...partnersList,
      children: [
        partnersUpdate,
      ],
    },
    profileList,
  ],
};
