import { createApp } from "vue";
import { createPinia } from "pinia";
import { layouts, mask, vuetify } from "@ozzcar11/utilities/plugins";
import { router } from "./router";
import { apollo } from "./plugins/apollo";
import { Colors, Icons } from "./config";
import App from "./App.vue";

import "./styles/main.scss";
import "vuetify/styles";

const pinia = createPinia();
createApp(App)
  .use(layouts)
  .use(router)
  .use(pinia)
  .use(vuetify(Colors, {
    icons: Icons,
  }))
  .use(mask)
  .use(apollo)
  .mount("#app");
