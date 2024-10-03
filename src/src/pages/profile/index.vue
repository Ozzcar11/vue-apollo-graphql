<script setup lang="ts">
import { computed, ref, unref, watch } from "vue";
import { type RouteLocationRaw, onBeforeRouteLeave, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useAsyncLoadings, useNotifications } from "@ozzcar11/utilities/composables";
import { isEqual, merge } from "lodash-es";
import {
  containsLetter,
  containsNumber,
  email,
  minLength,
  required,
  requiredIf,
  sameAs,
} from "@ozzcar11/utilities/validators";
import {
  VBtn,
  VChip,
  VCol,
  VRow,
  VSelect,
  VTextField,
} from "vuetify/components";
import { useAuthStore } from "@/modules/auth/stores/auth";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { refWithDefault } from "@/utils";

import AppForm from "@/components/app/AppForm.vue";
import AppDialog from "@/components/app/AppDialog.vue";

import { type User, type UsersProps } from "@/models";

import { useMeUpdate } from "@/modules/auth/composables/useMeUpdate";
import { useLogout } from "@/modules/auth/composables/useLogout";

import { useMask } from "@/composables/useMask";
import { useMe } from "@/modules/auth/composables/useMe";

import { PHONE_MASK, ROLES } from "@/constants";

import { validPhone } from "@/utils/validators";
import { profileList } from "@/router/routes/profile";

const router = useRouter();

const authStore = useAuthStore();

const { meUpdate } = useMeUpdate();

const { notificate } = useNotifications();
const { setBreadcrumbs } = useBreadcrumbsStore();

const { loadMe } = useMe();
const { logoutRequest } = useLogout();

const loading = useAsyncLoadings([]);

const cancelDialog = ref(false);
const ignoreLeave = ref(false);
const routeSave = ref<RouteLocationRaw>();

const passwordsEmpty = computed(() => {
  return form.ref.value.old_password === "" && form.ref.value.password === "" && form.ref.value.repeat_password === "";
});

const showPassword = ref(false);
const showRepeatPassword = ref(false);
const showOldPassword = ref(false);

const form = refWithDefault<UsersProps>({
  email: "",
  password: "",
  role: null,
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

const validationPassword = computed(() => {
  return form.ref.value.password ?? "";
});

const {
  maskedValue: phoneMasked,
  unmaskedValue: phoneUnmasked,
  mask: phoneMask,
  maskDetail: phoneMaskDetail,
} = useMask(form.ref.value.profile.phone, { mask: PHONE_MASK });

const rules = computed(() => ({
  profile: {
    firstname: { required },
    lastname: { required },
    phone: { required: requiredIf(() => phoneMasked.value === ""), validPhone: validPhone(phoneUnmasked) },
    work_name: { required },
    position: { required },
  },
  email: { required, email },
  password: {
    required: requiredIf(() => authStore.isSuperAdmin && !passwordsEmpty.value),
    minLength: minLength(8),
    containsLetter,
    containsNumber,
  },
  repeat_password: {
    required: requiredIf(() => authStore.isSuperAdmin && !passwordsEmpty.value),
    minLength: minLength(8),
    containsLetter,
    containsNumber,
    sameAs: sameAs(validationPassword, "Пароли не совпадают"),
  },
  old_password: {
    required: requiredIf(() => authStore.isSuperAdmin && !passwordsEmpty.value),
    minLength: minLength(8),
    containsLetter,
    containsNumber,
  },
}));

const v = useVuelidate(rules, form.ref.value as Required<UsersProps>);

const userFullName = computed(() => {
  const meProfile = form.ref.value.profile;

  return `${meProfile.lastname} ${meProfile.firstname} ${meProfile.middlename ?? ""}`;
});

void (async function() {
  try {
    const res = await loadMe();
    const me = res.data.me;

    const meValue = {
      email: me.email,
      role: me.role,
      application_limit: Math.abs(me.application_limit),
      maintainer: me.maintainer,
      profile: {
        firstname: me.profile.firstname,
        lastname: me.profile.lastname,
        middlename: me.profile.middlename,
        phone: me.profile.phone,
        position: me.profile.position,
        work_name: me.profile.work_name,
      },
    };

    merge(form.ref.value, meValue);

    phoneMasked.value = me.profile.phone;

    setBreadcrumbs([
      {
        title: "Мой профиль",
        to: { name: profileList.name },
      },
    ]);

    form.saveAsDefault();
  } catch (error) {
    notificate("Возникла техническая ошибка", { type: "error" });
  }
})();

function checkValidSession() {
  const formDefaultValue = {
    role: form.default.role,
    password: "",
  };

  const formValue = {
    password: form.ref.value.password,
    role: form.ref.value.role,
  };

  return !isEqual(formDefaultValue, formValue);
}

watch(phoneUnmasked, (value) => {
  form.ref.value.profile.phone = `+7${value}`;
});

async function onSubmit() {
  const isCorrect = await v.value.$validate();
  if (!isCorrect) return;

  const userData = form.ref.value;
  const user: UsersProps = {
    ...userData,
    old_password: authStore.isSuperAdmin && !passwordsEmpty.value ? userData.old_password : undefined,
    password: authStore.isSuperAdmin && !passwordsEmpty.value ? userData.password : undefined,
    repeat_password: authStore.isSuperAdmin && !passwordsEmpty.value ? userData.repeat_password : undefined,
  };

  try {
    await meUpdate({ user });

    if (checkValidSession()) {
      await logoutRequest();

      void router.push({ name: "login" });
    }

    if (authStore.user?.profile) {
      authStore.user.profile = userData.profile;
    }

    form.saveAsDefault();
    notificate("Изменения сохранены", { type: "success" });
  } catch (error) {
    console.error(error);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

async function toNextPage(withSafe: boolean = false) {
  cancelDialog.value = false;

  if (withSafe) {
    await onSubmit();
  }

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
  <AppForm
    :loading="loading"
  >
    <template #title>
      <div class="">
        <span class="mr-5">
          {{ userFullName }}
        </span>
        <VChip>{{ authStore.user?.role.title }}</VChip>
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
          <VTextField
            v-model="form.ref.value.profile.lastname"
            type="text"
            label="Фамилия"
            placeholder="Введите фамилию"
            :error-messages="v.profile.lastname.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.profile.lastname.$dirty || !v.profile.firstname.$invalid"
            :disabled="loading"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.profile.firstname"
            type="text"
            label="Имя"
            placeholder="Введите имя"
            :error-messages="v.profile.firstname.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.profile.firstname.$dirty || !v.profile.firstname.$invalid"
            :disabled="loading"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.profile.middlename"
            type="text"
            label="Отчество"
            placeholder="Введите отчество"
            :disabled="loading"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.email"
            type="text"
            label="Электронная почта"
            placeholder="Введите электронную почту"
            disabled
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="phoneMasked"
            v-mask:[phoneMask]="phoneMaskDetail"
            type="text"
            label="Телефон"
            placeholder="Введите телефон"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.profile.phone.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.profile.phone.$dirty || !v.profile.phone.$invalid"
            :disabled="loading"
          />
        </VCol>
      </VRow>
      <VRow v-if="authStore.isSuperAdmin">
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.old_password"
            :type="showOldPassword ? 'text' : 'password'"
            label="Старый пароль"
            placeholder="Введите старый пароль"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.old_password.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.old_password.$dirty || !v.old_password.$invalid"
            :disabled="loading"
            :append-inner-icon="showOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showOldPassword = !showOldPassword"
          />
        </VCol>
      </VRow>
      <VRow v-if="authStore.isSuperAdmin">
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.password"
            :type="showPassword ? 'text' : 'password'"
            label="Новый пароль"
            placeholder="Введите новый пароль"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.password.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.password.$dirty || !v.password.$invalid"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.repeat_password"
            :type="showRepeatPassword ? 'text' : 'password'"
            label="Повторите пароль"
            placeholder="Введите пароль повторно"
            :error-messages="v.repeat_password.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.repeat_password.$dirty || !v.repeat_password.$invalid"
            :disabled="loading"
            :append-inner-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showRepeatPassword = !showRepeatPassword"
          />
        </VCol>
      </VRow>
      <h6 class="section-title mt-6">
        Дополнительная информация
      </h6>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.profile.work_name"
            type="text"
            label="Наименование организации"
            placeholder="Введите наименование организации"
            :error-messages="v.profile.work_name.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.profile.work_name.$dirty || !v.profile.work_name.$invalid"
            :disabled="loading"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.profile.position"
            type="text"
            label="Должность"
            placeholder="Введите должность"
            :error-messages="v.profile.position.$errors.map((e) => unref(e.$message))"
            :hide-details="!v.profile.position.$dirty || !v.profile.position.$invalid"
            :disabled="loading"
          />
        </VCol>
      </VRow>
      <VRow v-if="authStore.role === ROLES.EXPERT">
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.ref.value.application_limit"
            :rules="[(value: number) => value > 0 || 'Лимит должен быть больше 0']"
            type="number"
            label="Лимит на количество проверяемых анкет в неделю"
            placeholder="Введите лимит"
            :min="0"
            disabled
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.ref.value.maintainer"
            type="text"
            :item-title="({ profile }: User) => `${profile.firstname} ${profile.lastname} ${profile.middlename}`"
            label="Прикреплен к администратору"
            placeholder="Введите должность"
            return-object
            disabled
          />
        </VCol>
      </VRow>
    </template>
    <template #footer>
      <VBtn
        class="mr-4"
        color="primary"
        :disabled="loading"
        :loading="loading"
        @click="onSubmit"
      >
        Сохранить
      </VBtn>
    </template>
  </AppForm>
  <AppDialog
    v-model="cancelDialog"
    submit-color="black"
    cancel-color="error"
    @submit="toNextPage(true)"
    @cancel="toNextPage(false)"
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
</template>
