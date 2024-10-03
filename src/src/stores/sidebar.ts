import { ref } from "vue";
import { defineStore } from "pinia";
import { useDisplay } from "vuetify";

export const useSidebarStore = defineStore("sidebar", () => {
  const display = useDisplay();

  const visible = ref(display.mdAndUp.value);

  function toggleVisibility() {
    visible.value = !visible.value;
  }

  return {
    visible,
    toggleVisibility,
  };
});
