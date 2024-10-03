<script setup lang="ts">
import { ref } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { type ApolloError } from "@apollo/client/core";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { emailTaken } from "@/utils/errors";
import { usersCreate, usersList } from "@/router/routes/users";

import AppDialog from "@/components/app/AppDialog.vue";
import UsersForm from "@/modules/users/components/UsersForm.vue";

import { useUsersCreate } from "@/modules/users/composables/useUsersCreate";
import { refWithDefault } from "@/utils";

import { type UsersProps } from "@/models/user";

const router = useRouter();

const form = refWithDefault<UsersProps>({
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

const { createUser, loading: createUserLoading } = useUsersCreate();

const loading = useAsyncLoadings([createUserLoading]);

const cancelDialog = ref(false);
const ignoreLeave = ref(false);
const routeSave = ref<RouteLocationRaw>();

setBreadcrumbs([
  {
    title: "Пользователи",
    to: { name: usersList.name },
  },
  {
    title: "Новый пользователь",
    to: { name: usersCreate.name },
  },
]);

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

  try {
    await createUser({ user: form.ref.value });
    toListPage(true);
  } catch (error) {
    const takenEmail = emailTaken(error as ApolloError);

    if (takenEmail) notificate("Пользователь с такой почтой уже существует", { type: "error" });
    else notificate("Произошла техническая ошибка", { type: "error" });
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
    title="Новый пользователь"
    :loading="loading"
    :disabled="v.$errors.length > 0 || loading || form.isDefault()"
    @cancel-form="toListPage"
    @submit-form="onSubmit"
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
      Вы покинете режим создания, сохранить внесённые изменения?
    </template>
    <template #submit>
      Сохранить
    </template>
    <template #cancel>
      Не сохранять
    </template>
  </AppDialog>
</template>
