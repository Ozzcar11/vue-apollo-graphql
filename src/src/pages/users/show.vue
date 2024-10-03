<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import {
  VBtn,
  VCard,
  VCardText,
  VChip,
  VCol,
  VDialog,
  VRow,
} from "vuetify/components";
import { useRole } from "v-role";
import { useAuthStore } from "@/modules/auth/stores/auth";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

import AppDialog from "@/components/app/AppDialog.vue";
import AppForm from "@/components/app/AppForm.vue";
import AppLable from "@/components/app/AppLable.vue";

import { useUsersGet } from "@/modules/users/composables/useUsersGet";
import { useUsersDelete } from "@/modules/users/composables/useUsersDelete";
import { usersList, usersShow } from "@/router/routes/users";

import { ROLES } from "@/constants";
import { profileList } from "@/router/routes/profile";
import { getFullName } from "@/modules/users/utils/getFullName";

const route = useRoute();
const router = useRouter();

const id = +route.params.id;

const v = useVuelidate();
const authStore = useAuthStore();
const { notificate } = useNotifications();
const { hasRole } = useRole();

const { user, loading: getUserLoading, onResult } = useUsersGet(id);
const { removeUser, loading: removeUserLoading } = useUsersDelete();

const { setBreadcrumbs } = useBreadcrumbsStore();

const loading = useAsyncLoadings([getUserLoading, removeUserLoading]);

const deleteDialog = ref(false);
const errorDialog = ref(false);

const userRole = ref<string>("");

const getComma = (idx: number, length?: number) => {
  if (!length) return;

  return idx === length - 1 ? "" : ", ";
};

const getLink = (id?: number) => {
  if (id === authStore.user?.id) return { name: profileList.name };

  return { name: usersShow.name, params: { id } };
};

onResult(() => {
  if (!user.value) return;

  setBreadcrumbs([
    {
      title: "Пользователи",
      to: { name: usersList.name },
    },
    {
      title: getFullName(user.value.profile),
      to: { name: usersShow.name, params: { id: id.toString() } },
    },
  ]);

  userRole.value = user.value.role.name;
});

function toListPage() {
  void router.push({ name: "users" });
}

function toEditPage() {
  void router.push({ name: "users.update" });
}

function onDeleteDialog() {
  const userExperts = user.value?.experts;

  if (!userExperts) return;

  if (userExperts.length > 0) errorDialog.value = true;
  else deleteDialog.value = true;
}

async function onDelete() {
  try {
    if (!user.value?.id) return;
    await removeUser(user.value.id);
    deleteDialog.value = false;
    toListPage();
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

watch(() => route.params.id, () => {
  router.go(0);
});
</script>

<template>
  <AppForm
    :loading="loading"
    @submit="toEditPage"
    @cancel="toListPage"
    @delete="onDelete"
  >
    <template #title>
      <div class="">
        <span class="mr-5">
          {{ getFullName(user?.profile) }}
        </span>
        <VChip>{{ user?.role.title }}</VChip>
      </div>
    </template>
    <template #default>
      <h6 class="section-title">
        Основная информация
      </h6>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Роль">
            {{ user?.role.title || "-" }}
          </AppLable>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Фамилия">
            {{ user?.profile.lastname || "-" }}
          </AppLable>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Имя">
            {{ user?.profile.firstname || "-" }}
          </AppLable>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Отчество">
            {{ user?.profile.middlename || "-" }}
          </AppLable>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Электронная почта">
            {{ user?.email || "-" }}
          </AppLable>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Телефон">
            {{ user?.profile.phone || "-" }}
          </AppLable>
        </VCol>
      </VRow>
      <h6 class="section-title py-5">
        Дополнительная информация
      </h6>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Наименование организации">
            {{ user?.profile.work_name || "-" }}
          </AppLable>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppLable label="Должность">
            {{ user?.profile.position || "-" }}
          </AppLable>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          v-if="userRole === ROLES.EXPERT"
          cols="12"
          md="6"
        >
          <AppLable label="Приклеплён к администратору">
            <RouterLink
              v-if="user?.maintainer"
              :to="getLink(user?.maintainer?.id)"
              class="mr-2 text-decoration-none text-primary"
            >
              {{ getFullName(user?.maintainer?.profile) }}
            </RouterLink>
          </AppLable>
        </VCol>
        <VCol
          v-if="userRole === ROLES.ADMIN"
          cols="12"
          md="6"
        >
          <AppLable label="Эксперты">
            <RouterLink
              v-for="(expert, index) in user?.experts"
              :key="expert.id"
              :to="{ name: usersShow.name, params: { id: expert.id } }"
              class="mr-2 text-decoration-none text-primary"
            >
              {{ getFullName(expert.profile) }}{{ getComma(index, user?.experts?.length) }}
            </RouterLink>
          </AppLable>
        </VCol>
        <VCol
          v-if="userRole !== ROLES.WATCHER && userRole !== ROLES.SUPERADMIN"
          cols="12"
          md="6"
        >
          <AppLable label="Лимит на кол-во анкет в неделю">
            {{ user?.application_limit ?? "-" }}
          </AppLable>
        </VCol>
      </VRow>
    </template>
    <template #footer>
      <VBtn
        v-if="hasRole(ROLES.SUPERADMIN)"
        class="mr-4"
        color="primary"
        :disabled="v.$errors.length > 0 || loading"
        :loading="loading"
        @click.prevent="toEditPage"
      >
        Редактировать
      </VBtn>
      <slot name="footer_extra_buttons" />
      <VBtn
        :disabled="v.$errors.length > 0 || loading"
        @click.prevent="toListPage"
      >
        Назад
      </VBtn>
      <VBtn
        v-if="hasRole(ROLES.SUPERADMIN)"
        class="ml-auto"
        color="red"
        variant="text"
        :disabled="v.$errors.length > 0 || loading"
        @click.prevent="onDeleteDialog"
      >
        Удалить
      </VBtn>
    </template>
  </AppForm>
  <AppDialog
    v-model="deleteDialog"
    @submit="onDelete"
  >
    <template #title>
      Вы хотите удалить пользователя?
    </template>
    <template #description>
      Пользователь будет полностью удален с сайта без возможности его восстановления
    </template>
    <template #submit>
      Удалить
    </template>
  </AppDialog>
  <VDialog
    v-model="errorDialog"
    max-width="400"
    class="dialog"
  >
    <VCard>
      <VCardText class="dialog__title">
        Вы не можете удалить администратора пока за ним закреплен эксперт
      </VCardText>
      <VBtn
        class="dialog__close-btn"
        icon="mdi-close"
        variant="text"
        @click="errorDialog = false"
      />
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.dialog {
  font-size: 24px;
  font-weight: 500 !important;
  padding: 8px;
  padding-right: 30px;

  &__title {
    font-size: 24px;
    white-space: wrap;
  }

  &__close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>
