import { useMutation } from "@vue/apollo-composable";
import importFile from "../graphql/importFile.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export type ImportFile = {
  import_type: string;
  file: File | null;
};

const abordController = new window.AbortController();

export const useImportFile = () => {
  const { mutate: fileImport, loading, onError, onDone } = useMutation<{ startImport: boolean }, { import: ImportFile }>(importFile,
    {
      clientId: APOLLO_CLIENTS.upload,
      context: {
        fetchOptions: {
          signal: abordController.signal,
        },
      },
    });

  return {
    fileImport,
    onError,
    loading,
    onDone,
    abort: () => abordController.abort(),
  };
};
