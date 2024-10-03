import { type ValueOf } from "@ozzcar11/utilities/types";
import { IMPORT_STATUS } from "@/constants";

export type UploadFile = {
  id: number;
  url: string;
  name: string;
  size?: string;
  extension: string;
};

export type Document = {
  id: number;
  title: string;
  file: UploadFile;
};

export type ImportProcessingStatus = ValueOf<typeof IMPORT_STATUS>;

export type ImportProcessing = {
  id: number;
  created_at: string;
  updated_at: string;
  rows_processed: number;
  status: ImportProcessingStatus;
};
