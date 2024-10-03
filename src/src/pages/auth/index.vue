<script setup lang="ts">
import {
  VContainer,
  VRow,
  VSheet,
} from "vuetify/components";

import LoginForm from "@/modules/auth/components/LoginForm.vue";
</script>

<template>
  <v-container
    class="h-100"
    fluid
  >
    <v-row
      align="center"
      justify="center"
      class="h-100"
    >
      <v-sheet>
        <LoginForm />
      </v-sheet>
    </v-row>
  </v-container>
</template>
