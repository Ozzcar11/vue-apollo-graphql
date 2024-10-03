<script setup lang="ts">
import { VBtn, VCol, VForm, VRow } from "vuetify/components";

type Props = {
  loading?: boolean;
  disabled?: boolean;
  showDelete?: boolean;
  width?: string;
};

type Emits = {
  (e: "submit"): void;
  (e: "cancel"): void;
  (e: "delete"): void;
};

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  showDelete: false,
  width: undefined,
});
defineEmits<Emits>();
</script>

<template>
  <div class="form h-100 d-flex flex-column">
    <header class="container mb-4 pb-4 mb-md-8 pb-md-8">
      <h1 class="text-h5 font-weight-regular">
        <slot name="title">
          Заголовок
        </slot>
      </h1>
    </header>
    <v-form class="container mb-4 mb-md-8">
      <v-row>
        <v-col
          v-if="!width"
          cols="12"
          md="6"
        >
          <slot />
        </v-col>
        <div
          v-else
          :style="{ 'width': width }"
        >
          <slot />
        </div>
      </v-row>
    </v-form>
    <footer class="container d-flex mt-auto py-4 py-md-8">
      <slot name="footer">
        <VBtn
          class="mr-4"
          color="primary"
          :disabled="disabled"
          :loading="loading"
          @click.prevent="$emit('submit')"
        >
          Сохранить
        </VBtn>
        <slot name="footer_extra_buttons" />
        <VBtn
          @click.prevent="$emit('cancel')"
        >
          Отмена
        </VBtn>
        <VBtn
          v-if="showDelete"
          class="form__delete"
          color="red"
          variant="text"
          :disabled="disabled"
          @click.prevent="$emit('delete')"
        >
          Удалить
        </VBtn>
      </slot>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.form {
  header {
    border-bottom: 2px solid #0000001F;
  }

  footer {
    box-shadow: 0 -2px 4px 0 #0003;
  }

  &__delete {
    margin-left: auto;
  }
}
</style>
