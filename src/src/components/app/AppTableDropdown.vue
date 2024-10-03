<script lang="ts" setup>
import { computed } from "vue";

import {
  VBtn,
  VList,
  VListItem,
  VListItemTitle,
  VMenu,
} from "vuetify/components";
import { Colors } from "@/config";

const props = defineProps<{
  hideAll?: boolean;
  hideShow?: boolean;
  hideDelete?: boolean;
  hideEdit?: boolean;
}>();

const menuItems = computed(() => {
  const items = [];

  if (props.hideAll) return [];

  if (!props.hideShow) items.push({ title: "Просмотр", icon: "mdi-eye", emit: "show" });
  if (!props.hideEdit) items.push({ title: "Редактировать", icon: "mdi-pencil", emit: "edit" });
  if (!props.hideDelete) items.push({ title: "Удалить", icon: "mdi-delete", emit: "remove", color: Colors.error });

  return items;
});
</script>

<template>
  <VMenu>
    <template #activator="{ props: menuProps }">
      <VBtn
        variant="text"
        v-bind="menuProps"
        icon="mdi-dots-vertical"
      />
    </template>
    <VList>
      <VListItem
        v-for="(item, index) in menuItems"
        :key="index"
        :value="index"
      >
        <VListItemTitle
          :style="{ color: item.color }"
          @click="$emit(item.emit)"
        >
          {{ item.title }}
        </VListItemTitle>
      </VListItem>
      <slot />
    </VList>
  </VMenu>
</template>
