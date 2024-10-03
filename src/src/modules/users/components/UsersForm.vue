<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  containsLetter,
  containsNumber,
  email,
  minLength,
  minValue,
  required,
  requiredIf,
  sameAs,
} from "@ozzcar11/utilities/validators";
import {
  VCol,
  VRow,
  VSelect,
  VTextField,
} from "vuetify/components";

import AppForm from "@/components/app/AppForm.vue";

import { loadUsers } from "@/modules/users/utils/loadUsers";
import { useRolesList } from "@/modules/roles/composables/useRolesList";

import { useMask } from "@/composables/useMask";

import { type Role, type User, type UsersProps } from "@/models";
import { PHONE_MASK, ROLES } from "@/constants";

import { validPhone } from "@/utils/validators";

const props = defineProps<{
  modelValue: UsersProps;
  title: string;
  loading: boolean;
  disabled: boolean;
  showDelete?: boolean;
  editForm?: boolean;
}>();

defineEmits<{
  (e: "submitForm"): void;
  (e: "cancelForm"): void;
  (e: "deleteForm"): void;
}>();

const { roles, loading: rolesListLoading, onResult } = useRolesList();

const model = ref(props.modelValue);
const showPassword = ref(false);
const showRepeatPassword = ref(false);

const createRoles = [ROLES.ADMIN, ROLES.EXPERT, ROLES.WATCHER];

const showApplicationLimit = computed(() => model.value.role?.name === ROLES.ADMIN || model.value.role?.name === ROLES.EXPERT);

const getPassword = computed(() => {
  return model.value.password ?? "";
});

const {
  maskedValue: phoneMasked,
  unmaskedValue: phoneUnmasked,
  mask: phoneMask,
  maskDetail: phoneMaskDetail,
} = useMask(model.value.profile.phone, { mask: PHONE_MASK });

const rules = computed(() => ({
  role: { required },
  profile: {
    firstname: { required },
    lastname: { required },
    phone: { required, validPhone: validPhone(phoneUnmasked) },
    work_name: { required },
    position: { required },
  },
  email: { required, email },
  application_limit: { required: requiredIf(showApplicationLimit.value), minValue: minValue(0) },
  maintainer: { required: requiredIf(model.value.role?.name === ROLES.EXPERT) },
  password: {
    required: requiredIf(!props.editForm),
    minLength: minLength(8),
    containsLetter,
    containsNumber,
  },
  repeat_password: {
    required: requiredIf(!props.editForm || !!getPassword.value),
    minLength: minLength(8),
    containsLetter,
    containsNumber,
    sameAs: sameAs(getPassword, "Пароли не совпадают"),
  },
}));

const v = useVuelidate(rules, model.value as Required<UsersProps>);

const rolesValue = computed(() => {
  return roles.value.filter((role) => createRoles.includes(role.name));
});

const filterUsers = ref<User[]>([]);

onResult(() => {
  void (async () => {
    const role = roles.value.find((role) => role.name === ROLES.ADMIN);

    if (!role) return;

    const { data } = await loadUsers(role);

    filterUsers.value = data.list.items.map(item => ({
      id: item.id,
      email: item.email,
      profile: item.profile,
      role: item.role,
      maintainer: item.maintainer,
      application_limit: item.application_limit,
      company: item.company,
    }));
  })();
});

watch(() => model.value.profile.phone, (value) => {
  phoneMasked.value = value;
}, {
  immediate: true,
});

watch(phoneUnmasked, (value) => {
  model.value.profile.phone = `+7${value}`;
});

</script>

<template>
  <AppForm
    :disabled="v.$errors.length > 0 || disabled"
    :loading="loading"
    :show-delete="showDelete"
    @submit="$emit('submitForm')"
    @cancel="$emit('cancelForm')"
    @delete="$emit('deleteForm')"
  >
    <template #title>
      {{ title }}
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
          <VSelect
            v-model="model.role"
            label="Роль"
            :items="rolesValue"
            :item-title="(item: Role) => item.title"
            :loading="rolesListLoading"
            :error-messages="v.role.$errors.map((e) => e.$message)"
            :hide-details="!v.role.$dirty || !v.role.$invalid"
            return-object
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="model.profile.lastname"
            type="text"
            label="Фамилия"
            placeholder="Введите фамилию"
            :error-messages="v.profile.lastname.$errors.map((e) => e.$message)"
            :hide-details="!v.profile.lastname.$dirty || !v.profile.firstname.$invalid"
            :disabled="loading"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="model.profile.firstname"
            type="text"
            label="Имя"
            placeholder="Введите имя"
            :error-messages="v.profile.firstname.$errors.map((e) => e.$message)"
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
            v-model="model.profile.middlename"
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
            v-model="model.email"
            type="text"
            label="Электронная почта"
            placeholder="Введите электронную почту"
            :error-messages="v.email.$errors.map((e) => e.$message)"
            :hide-details="!v.email.$dirty || !v.email.$invalid"
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
            v-model="phoneMasked"
            v-mask:[phoneMask]="phoneMaskDetail"
            type="text"
            label="Телефон"
            autocomplete="disabled"
            placeholder="Введите телефон"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.profile.phone.$errors.map((e) => e.$message)"
            :hide-details="!v.profile.phone.$dirty || !v.profile.phone.$invalid"
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
            v-model="model.password"
            :type="showPassword ? 'text' : 'password'"
            :label="editForm ? 'Новый пароль' : 'Пароль'"
            placeholder="Введите пароль"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.password.$errors.map((e) => e.$message)"
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
            v-model="model.repeat_password"
            :type="showRepeatPassword ? 'text' : 'password'"
            label="Повторите пароль"
            placeholder="Введите пароль повторно"
            readonly
            onfocus="this.removeAttribute('readonly')"
            :error-messages="v.repeat_password.$errors.map((e) => e.$message)"
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
            v-model="model.profile.work_name"
            type="text"
            label="Наименование организации"
            placeholder="Введите наименование организации"
            :error-messages="v.profile.work_name.$errors.map((e) => e.$message)"
            :hide-details="!v.profile.work_name.$dirty || !v.profile.work_name.$invalid"
            :disabled="loading"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="model.profile.position"
            type="text"
            label="Должность"
            placeholder="Введите должность"
            :error-messages="v.profile.position.$errors.map((e) => e.$message)"
            :hide-details="!v.profile.position.$dirty || !v.profile.position.$invalid"
            :disabled="loading"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          v-if="showApplicationLimit"
          cols="12"
          md="6"
        >
          <VTextField
            v-model.number="model.application_limit"
            type="number"
            :min="0"
            label="Лимит на кол-во проверяемых анкет в неделю"
            placeholder="Введите лимит"
            :error-messages="v.application_limit.$errors.map((e) => e.$message)"
            :hide-details="!v.application_limit.$dirty || !v.application_limit.$invalid"
            :disabled="loading"
          />
        </VCol>
        <VCol
          v-if="model.role?.name === ROLES.EXPERT"
          cols="12"
          md="6"
        >
          <VSelect
            v-model="model.maintainer"
            class="mb-4"
            label="Администраторы"
            :items="filterUsers"
            :item-title="({ profile }: UsersProps) => `${profile.lastname} ${profile.firstname} ${profile.middlename}`"
            :loading="loading"
            :error-messages="v.maintainer.$errors.map((e) => e.$message)"
            :hide-details="!v.maintainer.$dirty || !v.maintainer.$invalid"
            return-object
          />
        </VCol>
      </VRow>
    </template>
  </AppForm>
</template>
