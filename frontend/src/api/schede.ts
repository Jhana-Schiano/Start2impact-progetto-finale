export type Scheda = {
  id: number;
  dataInizio: string;
  dataFine: string;
  personalTrainerId: number;
  obiettivo: string;
  clienteId: number;
};

export type CreateSchedaInput = {
  dataInizio: string;
  dataFine: string;
  personalTrainerId: number;
  obiettivo: string;
  clienteId: number;
};

type GetAllSchedeResponse = {
  id: number;
  data_inizio: string;
  data_fine: string;
  personal_trainer_id: number;
  obiettivo: string;
  cliente_id: number;
};

type GetSchedaByIdResponse = {
  id: number;
  data_inizio: string;
  data_fine: string;
  personal_trainer_id: number;
  obiettivo: string;
  cliente_id: number;
};

export const getSchedeByClienteId = async (
  clienteId: number,
): Promise<Scheda[]> => {
  const response = await fetch("/api/schede");

  if (!response.ok) {
    throw new Error("Errore nel recupero schede cliente");
  }

  const schede = (await response.json()) as GetAllSchedeResponse[];

  return schede
    .filter((scheda) => scheda.cliente_id === clienteId)
    .map((scheda) => ({
      id: scheda.id,
      dataInizio: scheda.data_inizio,
      dataFine: scheda.data_fine,
      personalTrainerId: scheda.personal_trainer_id,
      obiettivo: scheda.obiettivo,
      clienteId: scheda.cliente_id,
    }));
};

export const getSchedaById = async (schedaId: number): Promise<Scheda> => {
  const response = await fetch(`/api/schede/${schedaId}`);

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error ?? "Errore nel recupero scheda");
  }

  const scheda = (await response.json()) as GetSchedaByIdResponse;

  return {
    id: scheda.id,
    dataInizio: scheda.data_inizio,
    dataFine: scheda.data_fine,
    personalTrainerId: scheda.personal_trainer_id,
    obiettivo: scheda.obiettivo,
    clienteId: scheda.cliente_id,
  };
};

export const createScheda = async (
  payload: CreateSchedaInput,
): Promise<void> => {
  const response = await fetch("/api/schede", {
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

    throw new Error(errorData?.error ?? "Errore nella creazione scheda");
  }
};
