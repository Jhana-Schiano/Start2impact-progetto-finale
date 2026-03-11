import { useCallback, useState } from "react";
import {
  createEsercizio as createEsercizioApi,
  type CreateEsercizioInput,
} from "../api/esercizi";

const useCreateEsercizio = () => {
  const [isCreatingEsercizio, setIsCreatingEsercizio] = useState(false);
  const [createEsercizioError, setCreateEsercizioError] = useState<
    string | null
  >(null);

  const clearCreateEsercizioError = useCallback(() => {
    setCreateEsercizioError(null);
  }, []);

  const createEsercizio = useCallback(
    async (payload: CreateEsercizioInput): Promise<number> => {
      try {
        setIsCreatingEsercizio(true);
        setCreateEsercizioError(null);
        return await createEsercizioApi(payload);
      } catch (error) {
        setCreateEsercizioError(
          error instanceof Error
            ? error.message
            : "Errore durante la creazione esercizio",
        );
        throw error;
      } finally {
        setIsCreatingEsercizio(false);
      }
    },
    [],
  );

  return {
    isCreatingEsercizio,
    createEsercizioError,
    clearCreateEsercizioError,
    createEsercizio,
  };
};

export default useCreateEsercizio;