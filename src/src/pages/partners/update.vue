<script setup lang="ts">
import { ref } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useAuthStore } from "@/modules/auth/stores/auth";

import AppDialog from "@/components/app/AppDialog.vue";
import PartnersForm from "@/modules/partners/components/PartnersForm.vue";

import { partnersList, partnersUpdate } from "@/router/routes/partners";

import { usePartnersGet } from "@/modules/partners/composables/usePartnersGet";
import { usePartnersUpdate } from "@/modules/partners/composables/usePartnersUpdate";
import { usePartnersDelete } from "@/modules/partners/composables/usePartnersDelete";
import { refWithDefault } from "@/utils";

import { type PartnersProps } from "@/models";

const route = useRoute();
const router = useRouter();

const id = +route.params.id;

const form = refWithDefault<PartnersProps>({
  link: "",
  description: "",
  name: "",
  image: null,
});

const v = useVuelidate();
const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();
const authStore = useAuthStore();

const { partner, loading: getPartnerLoading, onResult } = usePartnersGet(id);
const { updatePartner, loading: updatePartnerLoading } = usePartnersUpdate();
const { removePartner, loading: deletePartnerLoading } = usePartnersDelete();

const loading = useAsyncLoadings([getPartnerLoading, updatePartnerLoading, deletePartnerLoading]);

const cancelDialog = ref(false);
const ignoreLeave = ref(false);
const deleteDialog = ref(false);
const routeSave = ref<RouteLocationRaw>();

onResult(() => {
  if (!partner.value) return;

  Object.assign(form.ref.value, {
    id: partner.value.id,
    name: partner.value.name,
    link: partner.value.link,
    description: partner.value.description,
    image: partner.value.image,
  });

  setBreadcrumbs([
    {
      title: "Предложения от партнеров",
      to: { name: partnersList.name },
    },
    {
      title: form.ref.value.name,
      to: { name: partnersUpdate.name, params: { id: id.toString() } },
    },
  ]);

  form.saveAsDefault();
});

function toListPage(ignore: boolean = false) {
  ignoreLeave.value = ignore;
  void router.push({ name: partnersList.name });
}

async function onSubmit() {
  cancelDialog.value = false;
  const isCorrect = await v.value.$validate();
  if (!isCorrect) return;

  try {
    await updatePartner({ partnerOffer: form.ref.value });
    toListPage(true);
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

async function onDelete() {
  try {
    if (!form.ref.value.id) return;
    await removePartner(form.ref.value.id);
    deleteDialog.value = false;
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
    :title="form.ref.value.name"
    :loading="loading"
    :disabled="loading"
    :show-delete="authStore.isSuperAdmin"
    :editable="authStore.isSuperAdmin"
    @submit-form="onSubmit"
    @cancel-form="toListPage"
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
      Удалить предложение?
    </template>
    <template #description>
      Вы действительно хотите удалить предложение партнера?
    </template>
    <template #submit>
      Удалить
    </template>
  </AppDialog>
</template>
