<script setup lang="ts">
import { ref } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

import { partnersCreate, partnersList } from "@/router/routes/partners";

import AppDialog from "@/components/app/AppDialog.vue";
import PartnersForm from "@/modules/partners/components/PartnersForm.vue";

import { usePartnersCreate } from "@/modules/partners/composables/usePartnersCreate";
import { refWithDefault } from "@/utils";

import { type PartnersProps } from "@/models";

const router = useRouter();

const { setBreadcrumbs } = useBreadcrumbsStore();

const form = refWithDefault<PartnersProps>({
  link: "",
  description: "",
  name: "",
  image: null,
});

const v = useVuelidate();
const { notificate } = useNotifications();

const { createPartner, loading: createUserLoading } = usePartnersCreate();

const loading = useAsyncLoadings([createUserLoading]);

const cancelDialog = ref(false);
const ignoreLeave = ref(false);
const routeSave = ref<RouteLocationRaw>();

setBreadcrumbs([
  {
    title: "Предложения от партнеров",
    to: { name: partnersList.name },
  },
  {
    title: "Новое предложение",
    to: { name: partnersCreate.name },
  },
]);

function toListPage(ignore: boolean = false) {
  ignoreLeave.value = ignore;
  void router.push({ name: partnersList.name });
}

async function onSubmit() {
  cancelDialog.value = false;
  const isCorrect = await v.value.$validate();
  if (!isCorrect) return;

  try {
    await createPartner({ partnerOffer: form.ref.value });
    toListPage(true);
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

function toNextPage() {
  cancelDialog.value = false;

  if (routeSave.value) {
    ignoreLeave.value = true;
    void router.push(routeSave.value);
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
  <PartnersForm
    v-model="form.ref.value"
    title="Новое предложение"
    :loading="loading"
    :disabled="loading"
    editable
    @submit-form="onSubmit"
    @cancel-form="toListPage"
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
