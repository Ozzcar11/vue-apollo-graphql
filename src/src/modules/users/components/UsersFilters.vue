<script setup lang="ts">
import { computed, ref } from "vue";
import { VSelect } from "vuetify/components";
import { type Nullable } from "@ozzcar11/utilities/types";
import { type UsersListFilters } from "../composables/useUsersList";
import { type Role, type User } from "@/models";
import { loadUsers } from "@/modules/users/utils/loadUsers";

import { useRolesList } from "@/modules/roles/composables/useRolesList";
import { ROLES } from "@/constants";

type Props = {
  useFilters: UsersListFilters;
  visible: boolean;
};

type Filters = Nullable<{
  roles: Role[];
  maintainers: User[];
}>;

const props = defineProps<Props>();

const { roles: rolesList, loading, onResult } = useRolesList();

const filters = ref<Filters>({
  roles: null,
  maintainers: null,
});

const filtersUsersValue = ref<User[]>([]);

const allowedRoles = [ROLES.ADMIN, ROLES.EXPERT, ROLES.WATCHER];
const filtersRolesValue = computed(() => {
  return rolesList.value.filter(role => allowedRoles.includes(role.name));
});

onResult(() => {
  void (async () => {
    const role = rolesList.value.find((role) => role.name === ROLES.ADMIN);

    if (!role) return;

    const { data } = await loadUsers(role);

    filtersUsersValue.value = data.list.items.map(item => ({
      id: item.id,
      email: item.email,
      profile: item.profile,
      role: item.role,
      maintainer: item.maintainer,
      application_limit: item.application_limit,
    }));
  })();
});

function updateValues() {
  filters.value.roles = props.useFilters.filter.roles ?? [];
  filters.value.maintainers = props.useFilters.filter.maintainers ?? [];
}

function reset() {
  for (const key in filters.value) {
    filters.value[key as keyof Filters] = null;
  }
}

updateValues();

defineExpose({
  filters,
  reset,
});
</script>

<template>
  <VSelect
    v-model="filters.roles"
    class="mb-4"
    label="Роль"
    :items="filtersRolesValue"
    :item-title="(item: Role) => item.title"
    :item-value="(item: Role) => ([item])"
    hide-details
  />
  <VSelect
    v-model="filters.maintainers"
    class="mb-4"
    label="Администратор"
    :items="filtersUsersValue"
    :item-title="({ profile }: User) => `${profile.lastname} ${profile.firstname} ${profile.middlename}`"
    :item-value="(item: User) => ([item])"
    :loading="loading"
    hide-details
  />
</template>
