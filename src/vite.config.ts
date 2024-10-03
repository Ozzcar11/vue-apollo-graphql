/// <reference types="vitest" />

import { URL, fileURLToPath } from "node:url";
import { type ServerOptions, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Vuetify from "vite-plugin-vuetify";
import Graphql from "@rollup/plugin-graphql";

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");

  const proxy: ServerOptions["proxy"] = environment.VITE_APP_USE_PROXY === "true"
    ? {
      "/graphql": {
        target: environment.VITE_APP_API_DOMAIN,
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
      "/sanctum": {
        target: environment.VITE_APP_API_DOMAIN,
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    }
    : {};

  return {
    server: {
      host: "0.0.0.0",
      port: +environment.APP_PORT,
      proxy,
    },
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Vuetify({
        autoImport: false,
      }),
      Graphql(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("src", import.meta.url)),
      },
    },
    test: {
      include: ["./src/tests/**/*.test.ts"],
      environmentMatchGlobs: [
        ["./src/tests/**/*.test.ts", "happy-dom"],
      ],
    },
  };
});
