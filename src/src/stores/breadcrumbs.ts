import { ref } from "vue";
import { defineStore } from "pinia";
import { type Breadcrumb } from "@/types/breadcrumbs";

export const useBreadcrumbsStore = defineStore("breadcrumbs", () => {
  const breadcrumbs = ref<Breadcrumb[]>([]);

  function setBreadcrumbs(value: Breadcrumb[]) {
    breadcrumbs.value = value;
  }

  function setBreadcrumb(breadcrumb: Breadcrumb, index: number): void {
    breadcrumbs.value[index] = breadcrumb;
  }

  return {
    breadcrumbs,
    setBreadcrumbs,
    setBreadcrumb,
  };
});
