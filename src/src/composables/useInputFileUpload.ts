import { computed, ref, watch } from "vue";
import { useNotifications } from "@ozzcar11/utilities/composables";
import { useUploadFile } from "@/modules/file/composables/useUploadFile";
import { type UploadFile } from "@/models/file";
import { checkFileSize, checkFileType } from "@/utils/file";
import { FILE_UPLOAD_ERROR } from "@/constants/errors";
import { FILE_SIZES } from "@/constants";

type Options = {
  maxSize?: number;
  allowTypes?: string[];
  multiple?: boolean;
  hint?: string;
};

/**
 *
 * @param maxSize Максимальный размер файла в байтах
 * @param allowTypes Типы файлов ["png", "jpg", "jpeg"]
 * @param multiple Множественный выбор
 */
export const useInputFileUpload = (options?: Options) => {
  const { uploadFile, loading } = useUploadFile();
  const { notificate } = useNotifications();

  const fileValue = ref<File>();

  const uploadedFiles = ref<UploadFile[] | null>(null);

  const preview = computed(() => {
    if (!fileValue.value) return null;

    const file = fileValue.value;
    if (!file) return;

    return URL.createObjectURL(file);
  });

  function checkFileRestrictions(file: File, maxSize: number, allowTypes: string[]) {
    return [checkFileSize(file, maxSize, options?.hint), checkFileType(file, allowTypes)].every(Boolean);
  }

  watch(fileValue, async (selectedFiles) => {
    if (!selectedFiles) return;

    const {
      maxSize = 10 * FILE_SIZES.MB,
      allowTypes = ["png", "jpg", "jpeg", "svg"],
    } = options ?? {};

    const file = selectedFiles;
    if (!file) return;

    const pass = checkFileRestrictions(file, maxSize, allowTypes);
    if (!pass) {
      fileValue.value = undefined;

      return;
    }

    try {
      const result = await uploadFile({ file });
      const resultFiles = result?.data?.filesUpload;
      if (!resultFiles) throw new Error(FILE_UPLOAD_ERROR);

      uploadedFiles.value = [resultFiles];
    } catch (error) {
      console.error(error);
      notificate(FILE_UPLOAD_ERROR, { type: "error" });
    }
  });

  return {
    loading,
    files: fileValue,
    preview,
    uploadedFiles,
  };
};
