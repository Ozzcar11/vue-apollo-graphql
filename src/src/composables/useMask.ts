import { computed, reactive, ref, watch } from "vue";
import { type MaskInputOptions, type MaskaDetail } from "maska";

export function useMask(initialValue = "", maskInput: MaskInputOptions) {
  const maskedValue = ref(initialValue);
  const unmaskedValue = ref(initialValue);

  const mask = ref<MaskInputOptions>(maskInput);
  const maskDetail: MaskaDetail = reactive({
    masked: "",
    unmasked: "",
    completed: false,
  });

  const completed = computed(() => maskDetail.completed);

  watch(() => maskDetail.unmasked, (value) => {
    unmaskedValue.value = value;
  });

  return {
    maskedValue,
    unmaskedValue,
    mask,
    maskDetail,
    completed,
  };
}
