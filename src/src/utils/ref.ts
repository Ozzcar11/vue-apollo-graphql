import { type Ref, ref } from "vue";
import { cloneDeep, isEqual } from "lodash-es";
import { objectIsEmpty, objectIsFull } from "./object";

export function refWithDefault<V>(value: V) {
  return {
    ref: ref(value) as Ref<V>,
    default: cloneDeep(value),
    isDefault() {
      return isEqual(this.ref.value, this.default);
    },
    saveAsDefault() {
      this.default = cloneDeep(this.ref.value);
    },
    reset() {
      this.ref.value = this.default;
    },
    isEmpty() {
      return objectIsEmpty(this.ref.value ?? {});
    },
    isFull() {
      return objectIsFull(this.ref.value ?? {});
    },
  };
}
