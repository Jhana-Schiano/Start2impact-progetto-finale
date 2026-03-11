import { useCallback, useState } from "react";
import {
  createAllenamento as createAllenamentoApi,
  type CreateAllenamentoInput,
} from "../api/allenamenti";

const useCreateAllenamento = () => {
  const [isCreatingAllenamento, setIsCreatingAllenamento] = useState(false);
  const [createAllenamentoError, setCreateAllenamentoError] = useState<
    string | null
  >(null);

  const clearCreateAllenamentoError = useCallback(() => {
    setCreateAllenamentoError(null);
  }, []);

  const createAllenamento = useCallback(
    async (payload: CreateAllenamentoInput): Promise<number> => {
      try {
        setIsCreatingAllenamento(true);
        setCreateAllenamentoError(null);
        return await createAllenamentoApi(payload);
      } catch (error) {
        setCreateAllenamentoError(
          error instanceof Error
            ? error.message
            : "Errore durante la creazione allenamento",
        );
        throw error;
      } finally {
        setIsCreatingAllenamento(false);
      }
    },
    [],
  );

  return {
    isCreatingAllenamento,
    createAllenamentoError,
    clearCreateAllenamentoError,
    createAllenamento,
  };
};

export default useCreateAllenamento;
