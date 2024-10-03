<script setup lang="ts">
import { computed, ref, unref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { isEmpty } from "@ozzcar11/utilities";
import { helpers, url } from "@vuelidate/validators";
import {
  required,
} from "@ozzcar11/utilities/validators";
import {
  VBtn,
  VTextField,
  VTextarea,
} from "vuetify/components";

import AppForm from "@/components/app/AppForm.vue";
import AppImageLoader from "@/components/app/image/AppImageLoader.vue";

import { type PartnersProps } from "@/models";

const props = defineProps<{
  modelValue: PartnersProps;
  title: string;
  loading: boolean;
  disabled: boolean;
  showDelete?: boolean;
  editable?: boolean;
}>();

defineEmits<{
  (e: "submitForm"): void;
  (e: "cancelForm"): void;
  (e: "deleteForm"): void;
}>();
const model = ref(props.modelValue);

const rules = computed(() => ({
  name: { required },
  description: { required },
  link: { required, url: helpers.withMessage("Некорректная ссылка", url) },
  image: { required },
}));

const v = useVuelidate(rules, model.value);

const formIsEmpty = computed(() => Object.values(model.value).some((item) => isEmpty(item)));

const saveButtonDisabled = computed(() => props.disabled || formIsEmpty.value);
</script>

<template>
  <AppForm
    :disabled="v.$errors.length > 0 || disabled"
    :loading="loading"
    :show-delete="showDelete"
  >
    <template #title>
      {{ title }}
    </template>
    <template #default>
      <h6 class="section-title">
        Основная информация
      </h6>
      <VTextField
        v-model="model.name"
        type="text"
        label="Наименование организации"
        placeholder="Введите название"
        :error-messages="v.name.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.name.$dirty || !v.name.$invalid"
        :disabled="disabled || !editable"
        :loading="loading"
        class="mb-6"
      />
      <VTextarea
        v-model="model.description"
        placeholder="Описание"
        density="comfortable"
        :disabled="disabled || !editable"
        :error-messages="v.description.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.description.$dirty || !v.description.$invalid"
        :loading="loading"
        class="mb-6"
        rows="2"
      />
      <VTextField
        v-model="model.link"
        type="text"
        label="Ссылка на партнера"
        placeholder="Введите ссылку"
        :error-messages="v.link.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.link.$dirty || !v.link.$invalid"
        :disabled="disabled || !editable"
        :loading="loading"
        class="mb-6"
      />
      <AppImageLoader
        v-model:image="model.image"
        label="Изображение предложения"
        hint="Только .JPG, .JPEG, .SVG или .PNG (рекомендуемый размер 1024 на 1024 пикселей)"
        accept=".jpg,.jpeg,.png,.svg"
        :loading="loading"
        :disabled="disabled || !editable"
        :error-messages="v.image.$errors.map((e) => unref(e.$message))"
        :hide-details="!v.image.$dirty || !v.image.$invalid"
      />
    </template>
    <template #footer>
      <VBtn
        v-if="editable"
        class="mr-4"
        :color="saveButtonDisabled ? 'accent' : 'primary'"
        :disabled="saveButtonDisabled"
        :loading="loading"
        @click="$emit('submitForm')"
      >
        Сохранить
      </VBtn>
      <slot name="footer_extra_buttons" />
      <VBtn
        @click="$emit('cancelForm')"
      >
        {{ editable ? "Отменить" : "Назад" }}
      </VBtn>
      <VBtn
        v-if="editable"
        class="form__delete"
        color="red"
        variant="text"
        :disabled="disabled"
        @click="$emit('deleteForm')"
      >
        Удалить
      </VBtn>
    </template>
  </AppForm>
</template>

<style scoped lang="scss">
.form__delete {
  margin-left: auto;
}
</style>
