<script lang="ts" setup>
type Props = {
  label?: string;
};

defineProps<Props>();

</script>

<template>
  <div class="mb-4">
    <div
      v-if="label"
      class="text label"
    >
      {{ label }}
    </div>
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text {
  font-size: 14px;
  font-weight: 400;
  white-space: pre-wrap;
}

.label {
  opacity: 0.58;
  margin-bottom: 4px;
}
</style>
