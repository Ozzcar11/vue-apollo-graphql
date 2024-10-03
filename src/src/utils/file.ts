import { useNotifications } from "@ozzcar11/utilities/composables";

export const convertBlobToFile = (blob: Blob, fileName = "untitled") => {
  return new File([blob], fileName, { type: blob.type });
};

export const checkFileSize = (file: File, maxSize: number, message?: string) => {
  if (file.size > maxSize) {
    useNotifications().notificate(message ?? `Размер файла не может быть больше чем ${maxSize / 1024 / 1024} мб`, { type: "error" });

    return false;
  }

  return true;
};

export const checkFileType = (file: File, allowTypes: string[], message?: string) => {
  const type = file.name.split(".").at(-1)?.toLowerCase();
  if (type && !allowTypes.includes(`.${type}`)) {
    useNotifications().notificate(message ?? "Тип файла не поддерживается", { type: "error" });

    return false;
  }

  return true;
};
