import { useCallback, useState } from "react";
import { deleteEsercizio as deleteEsercizioApi } from "../api/esercizi";

const useDeleteEsercizio = () => {
  const [isDeletingEsercizio, setIsDeletingEsercizio] = useState(false);
  const [deleteEsercizioError, setDeleteEsercizioError] = useState<
    string | null
  >(null);

  const clearDeleteEsercizioError = useCallback(() => {
    setDeleteEsercizioError(null);
  }, []);

  const deleteEsercizio = useCallback(async (esercizioId: number) => {
    try {
      setIsDeletingEsercizio(true);
      setDeleteEsercizioError(null);
      await deleteEsercizioApi(esercizioId);
    } catch (error) {
      setDeleteEsercizioError(
        error instanceof Error
          ? error.message
          : "Errore durante l'eliminazione esercizio",
      );
      throw error;
    } finally {
      setIsDeletingEsercizio(false);
    }
  }, []);

  return {
    isDeletingEsercizio,
    deleteEsercizioError,
    clearDeleteEsercizioError,
    deleteEsercizio,
  };
};

export default useDeleteEsercizio;
