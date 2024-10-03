<script setup lang="ts">
import {
  VCard,
  VCardText,
  VToolbar,
  VToolbarTitle,
} from "vuetify/components";
</script>

<template>
  <v-card>
    <v-toolbar
      v-if="$slots.title"
      color="light-grey"
    >
      <v-toolbar-title>
        <slot name="title">
          Заголовок
        </slot>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
