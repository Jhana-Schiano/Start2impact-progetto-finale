export type Palestra = {
  id: number;
  nome: string;
  partitaIva: string;
  indirizzo: string;
  citta: string;
};

export type AttrezzoPalestra = {
  id: number;
  nome: string;
  anno: number;
  quantita: number;
  palestraId: number;
};

export type PalestraDati = {
  palestra: Palestra;
  attrezzi: AttrezzoPalestra[];
};

type PalestraApiResponse = {
  id: number;
  ragione_sociale: string;
  partita_iva: string;
  indirizzo: string;
  citta: string;
};

type AttrezzoApiResponse = {
  id: number;
  nome: string;
  anno: number;
  quantita: number;
  palestra_id: number;
};

type GetPalestraDatiApiResponse = {
  palestra: PalestraApiResponse;
  attrezzi: AttrezzoApiResponse[];
};

export const getPalestraDati = async (
  palestraId: number,
): Promise<PalestraDati> => {
  const response = await fetch(`/api/palestra/${palestraId}/dati`);

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error ?? "Errore nel recupero dati palestra");
  }

  const data = (await response.json()) as GetPalestraDatiApiResponse;

  return {
    palestra: {
      id: data.palestra.id,
      nome: data.palestra.ragione_sociale,
      partitaIva: data.palestra.partita_iva,
      indirizzo: data.palestra.indirizzo,
      citta: data.palestra.citta,
    },
    attrezzi: data.attrezzi.map((attrezzo) => ({
      id: attrezzo.id,
      nome: attrezzo.nome,
      anno: attrezzo.anno,
      quantita: attrezzo.quantita,
      palestraId: attrezzo.palestra_id,
    })),
  };
};
