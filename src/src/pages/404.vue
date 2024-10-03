<script setup lang="ts">
import { VBtn, VCol, VContainer, VRow } from "vuetify/components";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <v-container
    class="h-100 d-flex flex-column justify-center"
    fluid
  >
    <v-row
      class="text-center"
      align="center"
      justify="center"
    >
      <v-col cols="8">
        <h1 class="text-h1 font-weight-bold text-primary mb-2">
          404
        </h1>
        <p class="text-h5 font-weight-medium  mb-3">
          Извините, страница, которую вы запрашиваете, не найдена!
        </p>
        <v-btn
          size="default"
          color="primary"
          append-icon="mdi-keyboard-backspace"
          @click="router.back()"
        >
          Назад
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
