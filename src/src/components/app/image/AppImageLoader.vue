<script setup lang="ts">
import { computed, watch } from "vue";
import { VFileInput, VTextField } from "vuetify/components";
import AppImage from "./AppImage.vue";
import AppImageDownload from "./AppImageDownload.vue";
import { useInputFileUpload } from "@/composables/useInputFileUpload";
import { type Image } from "@/models";

type Props = {
  image: Image | null | undefined;
  label?: string;
  hint?: string;
  accept?: string;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
  errorMessages?: string | string[] | null;
  hideDetails?: boolean;
};

type Emits = {
  (e: "update:image", value: Props["image"]): void;
};

const props = withDefaults(defineProps<Props>(), {
  label: "Изображение",
  hint: "Только .JPG, .JPEG или .PNG файлы",
  accept: ".jpg,.jpeg,.png",
  type: "",
  errorMessages: null,
});
const emit = defineEmits<Emits>();

const {
  files: imageFiles,
  preview: imagePreview,
  loading: imageUploadLoading,
  uploadedFiles: uploadedImages,
} = useInputFileUpload({
  allowTypes: props.accept.split(","),
});
const previewOrFile = computed(() => props.image?.file.url ?? imagePreview.value);

function clear() {
  emit("update:image", null);
  imageFiles.value = undefined;
}

watch(uploadedImages, (value) => {
  if (!value) return;

  const file = value.at(0);
  if (!file) return;

  emit("update:image", { file });
});

</script>

<template>
  <v-file-input
    v-if="!image"
    v-model="imageFiles"
    prepend-inner-icon="mdi-paperclip"
    prepend-icon=""
    density="comfortable"
    clear-icon="mdi-close"
    :accept="accept"
    :label="label"
    :hint="hint"
    :loading="loading"
    :persistent-hint="!!hint"
    :disabled="imageUploadLoading || disabled"
    :error-messages="errorMessages"
    :hide-details="!!hint === false && hideDetails"
    class="mb-6"
  />
  <v-text-field
    v-else
    type="text"
    prepend-inner-icon="mdi-paperclip"
    readonly
    clearable
    clear-icon="mdi-close"
    density="comfortable"
    :disabled="disabled"
    :label="label"
    :hint="hint"
    :persistent-hint="!!hint"
    :error-messages="errorMessages"
    :hide-details="!!hint === false && hideDetails"
    :model-value="image.file.name ?? 'Не указано'"
    class="mb-6"
    @click:clear="clear"
  />
  <AppImage
    v-if="previewOrFile"
    :src="previewOrFile"
    class="image-preview-form mb-4"
    :closable="!disabled"
    @close="clear"
  />
  <AppImageDownload
    v-if="previewOrFile"
    :source="previewOrFile"
  />
</template>
