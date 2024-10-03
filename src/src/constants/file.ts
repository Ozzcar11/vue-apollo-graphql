export const FILE_SIZES = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

export const IMPORT_STATUS = {
  IMPORTING: "importing",
  COMPLETED: "completed",
  FAILED: "failed",
  SYNCING: "syncing",
  INDEXING: "indexing",
} as const;
