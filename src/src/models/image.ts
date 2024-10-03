import { type UploadFile } from "./file";

export type Image = {
  id?: number;
  file: UploadFile;
  type?: string;
  author?: string;
  description?: string;
};
