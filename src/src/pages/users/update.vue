<script setup lang="ts">
import { computed, ref } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { merge } from "lodash-es";
import { type ApolloError } from "@apollo/client";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { emailTaken } from "@/utils/errors";

import AppDialog from "@/components/app/AppDialog.vue";
import UsersForm from "@/modules/users/components/UsersForm.vue";

import { useUsersGet } from "@/modules/users/composables/useUsersGet";
import { useUsersUpdate } from "@/modules/users/composables/useUsersUpdate";
import { useUsersDelete } from "@/modules/users/composables/useUsersDelete";

import { refWithDefault } from "@/utils";
import { type UsersProps } from "@/models/user";
import { usersList, usersUpdate } from "@/router/routes/users";

const route = useRoute();
const router = useRouter();

const id = +route.params.id;

const form = refWithDefault<UsersProps>({
  id,
  email: "",
  role: null,
  password: "",
  old_password: "",
  repeat_password: "",
  application_limit: null,
  maintainer: null,
  profile: {
    firstname: "",
    lastname: "",
    middlename: "",
    phone: "",
    position: "",
    work_name: "",
  },
});

const v = useVuelidate();
const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();

const { user, loading: getUserLoading, onResult } = useUsersGet(id);
const { updateUser, loading: updateUserLoading } = useUsersUpdate();
const { removeUser, loading: removeUserLoading } = useUsersDelete();

const loading = useAsyncLoadings([getUserLoading, updateUserLoading, removeUserLoading]);

const cancelDialog = ref(false);
const ignoreLeave = ref(false);
const deleteDialog = ref(false);
const routeSave = ref<RouteLocationRaw>();

const userFullName = computed(() => {
  if (!user.value) return "---";
  const userProfile = user.value.profile;

  return `${userProfile.lastname} ${userProfile.firstname} ${userProfile.middlename}`;
});

onResult(() => {
  if (!user.value) return;

  merge(form.ref.value, {
    id: user.value.id,
    email: user.value.email,
    role: user.value.role,
    profile: user.value.profile,
    application_limit: Math.abs(user.value.application_limit),
    maintainer: user.value.maintainer,
  });

  setBreadcrumbs([
    {
      title: "Пользователи",
      to: { name: usersList.name },
    },
    {
      title: userFullName.value,
      to: { name: usersUpdate.name, params: { id: id.toString() } },
    },
  ]);

  form.saveAsDefault();
});

function toListPage(ignore: boolean = false) {
  ignoreLeave.value = ignore;
  void router.push({ name: "users" });
}

function toNextPage() {
  cancelDialog.value = false;

  if (routeSave.value) {
    ignoreLeave.value = true;
    void router.push(routeSave.value);
  }
}

async function onSubmit() {
  cancelDialog.value = false;
  const isCorrect = await v.value.$validate();
  if (!isCorrect) return;

  const user = form.ref.value;
  if (user.password === "") delete user.password;
  if (user.repeat_password === "") delete user.repeat_password;

  try {
    await updateUser({ user: form.ref.value });
    toListPage(true);
  } catch (error) {
    if ((error as ApolloError).graphQLErrors) {
      const takenEmail = emailTaken(error as ApolloError);

      if (takenEmail) notificate("Пользователь с такой почтой уже существует", { type: "error" });
      else notificate("Произошла техническая ошибка", { type: "error" });
    }
  }
}

async function onDelete() {
  try {
    if (!form.ref.value.id) return;
    await removeUser(form.ref.value.id);
    deleteDialog.value = false;
    toListPage(true);
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

onBeforeRouteLeave((value) => {
  if (!form.isDefault() && !ignoreLeave.value) {
    cancelDialog.value = true;
    routeSave.value = value;

    return false;
  }
});
</script>

<template>
  <UsersForm
    v-model="form.ref.value"
    :title="userFullName"
    :loading="loading"
    :disabled="v.$errors.length > 0 || loading"
    show-delete
    edit-form
    @cancel-form="toListPage"
    @submit-form="onSubmit"
    @delete-form="deleteDialog = true"
  />
  <AppDialog
    v-model="cancelDialog"
    submit-color="black"
    cancel-color="error"
    @submit="onSubmit()"
    @cancel="toNextPage()"
  >
    <template #title>
      Вы хотите сохранить изменения?
    </template>
    <template #description>
      Вы покинете режим редактирования, сохранить внесённые изменения?
    </template>
    <template #submit>
      Сохранить
    </template>
    <template #cancel>
      Не сохранять
    </template>
  </AppDialog>
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
</template>
