import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllenamentiBySchedaId, type Allenamento } from "../api/allenamenti";
import { getEserciziByAllenamentoIds, type Esercizio } from "../api/esercizi";
import { getSchedaById, type Scheda } from "../api/schede";

type UseSchedaDataParams = {
  clienteIdParam?: string;
  schedaIdParam?: string;
};

const giornoOrder: Record<Allenamento["giorno"], number> = {
  Lunedi: 1,
  Martedi: 2,
  Mercoledi: 3,
  Giovedi: 4,
  Venerdi: 5,
  Sabato: 6,
  Domenica: 7,
};

const useSchedaData = ({
  clienteIdParam,
  schedaIdParam,
}: UseSchedaDataParams) => {
  const [scheda, setScheda] = useState<Scheda | null>(null);
  const [allenamenti, setAllenamenti] = useState<Allenamento[]>([]);
  const [esercizi, setEsercizi] = useState<Esercizio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedAllenamenti = useMemo(
    () =>
      [...allenamenti].sort((a, b) => {
        const byGiorno = giornoOrder[a.giorno] - giornoOrder[b.giorno];
        if (byGiorno !== 0) {
          return byGiorno;
        }

        return a.id - b.id;
      }),
    [allenamenti],
  );

  const eserciziByAllenamento = useMemo(() => {
    const grouped = new Map<number, Esercizio[]>();

    esercizi.forEach((esercizio) => {
      const current = grouped.get(esercizio.allenamentoId) ?? [];
      current.push(esercizio);
      grouped.set(esercizio.allenamentoId, current);
    });

    grouped.forEach((items, allenamentoId) => {
      grouped.set(
        allenamentoId,
        [...items].sort((a, b) => a.id - b.id),
      );
    });

    return grouped;
  }, [esercizi]);

  const reload = useCallback(async () => {
    const clienteId = Number(clienteIdParam);
    const targetSchedaId = Number(schedaIdParam);

    if (
      !Number.isInteger(clienteId) ||
      clienteId <= 0 ||
      !Number.isInteger(targetSchedaId) ||
      targetSchedaId <= 0
    ) {
      setError("Id scheda non valido");
      setScheda(null);
      setAllenamenti([]);
      setEsercizi([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [schedaSelezionata, allenamentiScheda] = await Promise.all([
        getSchedaById(targetSchedaId),
        getAllenamentiBySchedaId(targetSchedaId),
      ]);

      if (schedaSelezionata.clienteId !== clienteId) {
        setError("Scheda non trovata");
        setScheda(null);
        setAllenamenti([]);
        setEsercizi([]);
        return;
      }

      const eserciziScheda = await getEserciziByAllenamentoIds(
        allenamentiScheda.map((allenamento) => allenamento.id),
      );

      setScheda(schedaSelezionata);
      setAllenamenti(allenamentiScheda);
      setEsercizi(eserciziScheda);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Errore nel caricamento scheda",
      );
    } finally {
      setIsLoading(false);
    }
  }, [clienteIdParam, schedaIdParam]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    scheda,
    sortedAllenamenti,
    eserciziByAllenamento,
    isLoading,
    error,
    reload,
  };
};

export default useSchedaData;
