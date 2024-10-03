<script setup lang="ts">
import { computed, watch } from "vue";
import { VBtn, VFileInput, VTextField } from "vuetify/components";
import { useInputFileUpload } from "@/composables/useInputFileUpload";
import { type UploadFile } from "@/models";

type Props = {
  modelValue: UploadFile | UploadFile[] | null;
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  errorMessages?: string[] | null;
  filesLimit?: number | null;
  maxSize?: number;
  hideDownload?: boolean;
};

type Emits = {
  (e: "update:modelValue", value: Props["modelValue"]): void;
};

const props = withDefaults(defineProps<Props>(), {
  label: "Файл",
  hint: "Только .pdf файлы",
  accept: ".pdf",
  multiple: false,
  errorMessages: null,
  filesLimit: null,
  maxSize: 10 * 1024 * 1024,
});
const emit = defineEmits<Emits>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const modelTitle = computed(() => {
  if (Array.isArray(model.value)) return model.value.map(item => item.name).join(", ");

  return model.value?.name;
});
const inputFileVisible = computed(() => {
  if (Array.isArray(model.value)) return model.value.length === 0;

  return model.value == null;
});

const { files, loading: uploadFileLoading, uploadedFiles } = useInputFileUpload({
  allowTypes: props.accept.split(","),
  multiple: props.multiple,
  maxSize: props.maxSize,
  hint: props.hint,
});

function clear() {
  if (Array.isArray(model.value)) model.value = [];
  else model.value = null;
  files.value = [];
}

function download() {
  if (Array.isArray(model.value)) {
    for (const file of model.value) {
      if (!file.url) continue;
      window.open(file.url, "_blank");
    }

    return;
  }

  const url = model.value?.url;
  if (!url) return;

  window.open(url, "_blank");
}

watch(uploadedFiles, (value) => {
  if (!value) return;

  if (!props.multiple) {
    model.value = value.at(0) || null;

    return;
  }

  if (Array.isArray(model.value)) {
    const files = [...model.value, ...value];
    if (props.filesLimit && files.length > props.filesLimit) {
      files.splice(0, props.filesLimit);
    }

    model.value = files;

    return;
  }

  model.value = [...value];
});
</script>

<template>
  <v-file-input
    v-if="inputFileVisible"
    v-model="files"
    :accept="accept"
    :label="label"
    :hint="hint"
    :loading="uploadFileLoading"
    prepend-inner-icon="mdi-paperclip"
    prepend-icon=""
    persistent-hint
    density="comfortable"
    clear-icon="mdi-close"
    :multiple="multiple"
    :error-messages="errorMessages"
  />
  <template v-else>
    <v-text-field
      type="text"
      :label="label"
      :hint="hint"
      prepend-inner-icon="mdi-paperclip"
      readonly
      clearable
      clear-icon="mdi-close"
      persistent-hint
      :model-value="modelTitle"
      :error-messages="errorMessages"
      density="comfortable"
      class="mb-4"
      @click:clear="clear"
    />
    <v-btn
      v-if="hideDownload"
      type="button"
      variant="text"
      color="primary"
      @click.prevent="download"
    >
      Скачать файл
    </v-btn>
  </template>
</template>
