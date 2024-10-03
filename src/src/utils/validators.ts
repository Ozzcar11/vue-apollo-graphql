import { type Ref } from "vue";
import { helpers } from "@vuelidate/validators";

export const validPhone = (phoneUnmasked: Ref<string>, sameTo: number = 10) => {
  const validator = (value: string) => {
    if (!value) return true;

    return phoneUnmasked.value.length === sameTo;
  };

  return helpers.withMessage("Это поле обязательное для заполнения", validator);
};
