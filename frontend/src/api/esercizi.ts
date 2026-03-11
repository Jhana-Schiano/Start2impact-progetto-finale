export type Esercizio = {
  id: number;
  nome: string;
  attrezzo: string | null;
  allenamentoId: number;
  numeroSerie: number;
  ripetizioni: number;
  riposo: number;
  volume: number | null;
};

export type CreateEsercizioInput = {
  nome: string;
  attrezzo: string | null;
  allenamentoId: number;
  numeroSerie: number;
  ripetizioni: number;
  riposo: number;
  volume: number | null;
};

type GetAllEserciziResponse = {
  id: number;
  nome: string;
  attrezzo: string | null;
  allenamento_id: number;
  numero_serie: number;
  ripetizioni: number;
  riposo: number;
  volume: number | null;
};

export const getEserciziByAllenamentoIds = async (
  allenamentoIds: number[],
): Promise<Esercizio[]> => {
  if (allenamentoIds.length === 0) {
    return [];
  }

  const response = await fetch("/api/esercizi");

  if (!response.ok) {
    throw new Error("Errore nel recupero esercizi");
  }

  const esercizi = (await response.json()) as GetAllEserciziResponse[];
  const idSet = new Set(allenamentoIds);

  return esercizi
    .filter((esercizio) => idSet.has(esercizio.allenamento_id))
    .map((esercizio) => ({
      id: esercizio.id,
      nome: esercizio.nome,
      attrezzo: esercizio.attrezzo,
      allenamentoId: esercizio.allenamento_id,
      numeroSerie: esercizio.numero_serie,
      ripetizioni: esercizio.ripetizioni,
      riposo: esercizio.riposo,
      volume: esercizio.volume,
    }));
};

export const createEsercizio = async (
  payload: CreateEsercizioInput,
): Promise<number> => {
  const response = await fetch("/api/esercizi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error ?? "Errore nella creazione esercizio");
  }

  const data = (await response.json()) as { id: number };
  return data.id;
};
