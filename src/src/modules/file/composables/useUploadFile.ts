import { useMutation } from "@vue/apollo-composable";
import file from "../graphql/file.mutation.gql";
import { type UploadFile } from "@/models/file";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export type UploadFileProps = {
  file: File;
};

export const useUploadFile = () => {
  const { mutate: uploadFile, loading, onError } = useMutation<{ filesUpload: UploadFile }, UploadFileProps>(file, { clientId: APOLLO_CLIENTS.upload });

  return {
    uploadFile,
    onError,
    loading,
  };
};
