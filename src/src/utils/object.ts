import { isEmpty } from "@ozzcar11/utilities";

export const objectIsEmpty = (value?: Record<string, unknown> | null) => {
  if (!value) return true;

  return Object.values(value).every((item) => isEmpty(item));
};

export const objectIsFull = (value?: Record<string, unknown> | null) => {
  if (!value) return false;

  return Object.values(value).some((item) => !isEmpty(item));
};
