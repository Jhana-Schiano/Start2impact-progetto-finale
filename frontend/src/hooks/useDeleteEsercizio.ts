import { useCallback, useState } from "react";
import { deleteEsercizio as deleteEsercizioApi } from "../api/esercizi";

const useDeleteEsercizio = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const deleteEsercizio = useCallback(async (esercizioId: number) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await deleteEsercizioApi(esercizioId);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Errore durante l'eliminazione esercizio",
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    submitError,
    clearSubmitError,
    deleteEsercizio,
  };
};

export default useDeleteEsercizio;
