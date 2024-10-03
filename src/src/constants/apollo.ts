export const APOLLO_CLIENTS = {
  admin: "default",
  public: "public",
  upload: "upload",
} as const;

export const API_DOMAIN = import.meta.env.PROD ? import.meta.env.VITE_APP_API_DOMAIN : "";
