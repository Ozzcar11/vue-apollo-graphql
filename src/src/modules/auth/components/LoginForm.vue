<script setup lang="ts">
import { computed, ref, unref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useNotifications } from "@ozzcar11/utilities/composables";
import { email, required } from "@ozzcar11/utilities/validators";
import {
  VBtn,
  VTextField,
} from "vuetify/components";
import { type LoginRequest, useLogin } from "../composables/useLogin";
import { useAuthStore } from "../stores/auth";
import { INVALID_CREDENTIALS } from "@/constants/errors";
import { ROLES } from "@/constants";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginRequest>({
  email: "",
  password: "",
});

const disableBtn = computed(() => {
  const { email, password } = form.value;

  return !email || !password;
});

const rules = computed(() => ({
  email: { required, email },
  password: { required },
}));

const v = useVuelidate(rules, form);
const { notificate } = useNotifications();
const { loginRequest, loading } = useLogin();

async function onSubmit() {
  const isCorrect = await v.value.$validate();
  if (!isCorrect) return;

  try {
    const response = await loginRequest(form.value);
    const login = response?.data?.login;

    if (!login) throw new Error(INVALID_CREDENTIALS);

    authStore.authUser(login.user);

    void router.push({ name: login.user.role.name === ROLES.EXPERT ? "profile" : "users" });
  } catch (error) {
    console.error(error);
    notificate(INVALID_CREDENTIALS, { type: "error" });
  }
}
</script>

<template>
  <div class="login-form">
    <h1 class="login-form__title">
      Авторизация
    </h1>
    <VTextField
      v-model="form.email"
      name="email"
      label="E-mail"
      type="text"
      :error-messages="v.email.$errors.map(e => unref(e.$message))"
      :hide-details="!v.email.$dirty || !v.email.$invalid"
      :loading="loading"
      density="comfortable"
    />
    <VTextField
      v-model="form.password"
      class="mt-3 mb-8"
      name="password"
      label="Пароль"
      type="password"
      :loading="loading"
      :error-messages="v.password.$errors.map(e => unref(e.$message))"
      :hide-details="!v.password.$dirty || !v.password.$invalid"
      density="comfortable"
    />
    <VBtn
      class="flex-grow-1"
      :color="disableBtn ? 'accent' : 'primary'"
      :loading="loading"
      :disabled="disableBtn"
      @click="onSubmit"
    >
      Войти
    </VBtn>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 32px;

  &__title {
    margin-bottom: 32px;
    font-size: 23px;
    text-align: center;
    font-weight: 400;
  }
}
</style>
