/// <reference types="vite/client" />

declare module "*.vue" {
  import { type DefineComponent } from "vue";
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module "*.gql" {
  import { DocumentNode } from "graphql";

  const gql: DocumentNode;

  export default gql;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_API_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
