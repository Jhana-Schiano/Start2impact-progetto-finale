import { useCallback, useState } from "react";
import {
  createEsercizio as createEsercizioApi,
  type CreateEsercizioInput,
} from "../api/esercizi";

const useCreateEsercizio = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const createEsercizio = useCallback(
    async (payload: CreateEsercizioInput): Promise<number> => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        return await createEsercizioApi(payload);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Errore durante la creazione esercizio",
        );
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    isSubmitting,
    submitError,
    clearSubmitError,
    createEsercizio,
  };
};

export default useCreateEsercizio;
