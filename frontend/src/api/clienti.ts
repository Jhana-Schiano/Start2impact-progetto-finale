export type Cliente = {
  id: number;
  nome: string;
  cognome: string;
  dataNascita: string;
  sesso: "M" | "F" | "Altro";
};

export type CreateClienteInput = {
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  lavoro?: string;
  terapie?: string;
  condizioniMediche?: string;
  note?: string;
  dataNascita: string;
  sesso: "M" | "F" | "Altro";
  altezza: number;
  peso: number;
  massaMagra?: number;
  massaGrassa?: number;
};

type GetAllClientiResponse = {
  id: number;
  nome: string;
  cognome: string;
  data_nascita: string;
  sesso: "M" | "F" | "Altro";
};

export const getAllClienti = async (): Promise<Cliente[]> => {
  const response = await fetch("/api/clienti");

  if (!response.ok) {
    throw new Error("Errore nel recupero clienti");
  }

  const data = (await response.json()) as GetAllClientiResponse[];

  return data.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    cognome: cliente.cognome,
    dataNascita: cliente.data_nascita,
    sesso: cliente.sesso,
  }));
};

export const createCliente = async (
  payload: CreateClienteInput,
): Promise<void> => {
  const response = await fetch("/api/clienti", {
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

    throw new Error(errorData?.error ?? "Errore nella creazione cliente");
  }
};
