export type Scheda = {
  id: number;
  titolo: string;
  dataInizio: string;
  dataFine: string;
  personalTrainerId: number;
  obiettivo: string;
  clienteId: number;
};

type GetAllSchedeResponse = {
  id: number;
  titolo: string;
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
      titolo: scheda.titolo,
      dataInizio: scheda.data_inizio,
      dataFine: scheda.data_fine,
      personalTrainerId: scheda.personal_trainer_id,
      obiettivo: scheda.obiettivo,
      clienteId: scheda.cliente_id,
    }));
};
