import { type AnyObject } from "@ozzcar11/utilities/types";

export const removeEmptyArrays = (filters: AnyObject) => {
  return Object.fromEntries(Object.entries(filters).map(entry => {
    const [key, value] = entry;
    if (Array.isArray(value) && value.length === 0) return [key, null];

    return entry;
  }));
};
