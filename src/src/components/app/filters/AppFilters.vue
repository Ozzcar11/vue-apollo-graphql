<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue";
import { pick } from "lodash-es";
import { isEmpty } from "@ozzcar11/utilities";

type Props = {
  filters: T;
  keys: Array<keyof T>;
};

const props = defineProps<Props>();

const onlyNeeded = computed(() => pick(props.filters, props.keys));
const truthyItems = computed(() => Object.values(onlyNeeded.value).filter(item => !isEmpty(item)));
const hasSelectedFilters = computed(() => truthyItems.value.length > 0);
</script>

<template>
  <div class="app-filters mt-8">
    <div
      v-if="hasSelectedFilters"
      class="app-filters__bottom-line"
    >
      <div class="app-filters__title">
        Выбранные фильтры:
      </div>
      <div class="app-filters__list">
        <slot v-bind="{ items: onlyNeeded }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-filters {
  &__top-line {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;

    :deep(.app-search) {
      max-width: 330px;
    }
  }

  &__bottom-line {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 24px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  &__title {
    flex-shrink: 0;
    font-size: 14px;
    line-height: 20px;
    color: #666;
    letter-spacing: 0.25px;
    margin-right: 20px;
    margin-bottom: 0;

    @media screen and (max-width: 768px) {
      margin-bottom: 20px;
    }
  }
}
</style>
