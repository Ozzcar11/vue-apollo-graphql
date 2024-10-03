<script setup lang="ts">
import { ref } from "vue";
import { VBtn } from "vuetify/components";
import Cookies from "js-cookie";

type Props = {
  source: string;
  fileName?: string;
};

const props = withDefaults(defineProps<Props>(), {
  fileName: "image.png",
});

const loading = ref(false);

async function downloadFromSource() {
  loading.value = true;
  try {
    let href = "";

    if (props.source.includes("blob:")) href = props.source;
    else {
      const response = await fetch(props.source, {
        headers: {
          "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });
      const blobImage = await response.blob();
      href = URL.createObjectURL(blobImage);
    }

    const anchorElement = document.createElement("a");
    anchorElement.href = href;
    anchorElement.download = props.fileName;

    document.body.append(anchorElement);
    anchorElement.click();
    anchorElement.remove();

    window.URL.revokeObjectURL(href);
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
}
</script>

<template>
  <v-btn
    type="button"
    :disabled="loading"
    variant="text"
    color="primary"
    class="download-button"
    @click="downloadFromSource"
  >
    Скачать изображение
  </v-btn>
</template>
