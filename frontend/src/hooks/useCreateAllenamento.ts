import { useCallback, useState } from "react";
import {
  createAllenamento as createAllenamentoApi,
  type CreateAllenamentoInput,
} from "../api/allenamenti";

const useCreateAllenamento = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const createAllenamento = useCallback(
    async (payload: CreateAllenamentoInput): Promise<number> => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        return await createAllenamentoApi(payload);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Errore durante la creazione allenamento",
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
    createAllenamento,
  };
};

export default useCreateAllenamento;
