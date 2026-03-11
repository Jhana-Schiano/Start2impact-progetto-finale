export const ALLENAMENTO_GIORNI = [
  "Lunedi",
  "Martedi",
  "Mercoledi",
  "Giovedi",
  "Venerdi",
  "Sabato",
  "Domenica",
] as const;

export type GiornoAllenamento = (typeof ALLENAMENTO_GIORNI)[number];

export type Allenamento = {
  id: number;
  schedaId: number;
  durataStimata: number;
  areeCoinvolte: string;
  giorno: GiornoAllenamento;
};

export type CreateAllenamentoInput = {
  schedaId: number;
  durataStimata: number;
  areeCoinvolte: string;
  giorno: GiornoAllenamento;
};

type GetAllAllenamentiResponse = {
  id: number;
  scheda_id: number;
  durata_stimata: number;
  aree_coinvolte: string;
  giorno: GiornoAllenamento;
};

export const getAllenamentiBySchedaId = async (
  schedaId: number,
): Promise<Allenamento[]> => {
  const response = await fetch("/api/allenamenti");

  if (!response.ok) {
    throw new Error("Errore nel recupero allenamenti");
  }

  const allenamenti = (await response.json()) as GetAllAllenamentiResponse[];

  return allenamenti
    .filter((allenamento) => allenamento.scheda_id === schedaId)
    .map((allenamento) => ({
      id: allenamento.id,
      schedaId: allenamento.scheda_id,
      durataStimata: allenamento.durata_stimata,
      areeCoinvolte: allenamento.aree_coinvolte,
      giorno: allenamento.giorno,
    }));
};

export const createAllenamento = async (
  payload: CreateAllenamentoInput,
): Promise<number> => {
  const response = await fetch("/api/allenamenti", {
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

    throw new Error(errorData?.error ?? "Errore nella creazione allenamento");
  }

  const data = (await response.json()) as { id: number };
  return data.id;
};
