export type Cliente = {
  id: number;
  nome: string;
  cognome: string;
  dataNascita: string;
  sesso: "M" | "F" | "Altro";
};

export type ClienteDettaglio = {
  id: number;
  nome: string;
  cognome: string;
  dataNascita: string;
  indirizzo: string | null;
  citta: string | null;
  telefono: string | null;
  email: string;
  sesso: "M" | "F" | "Altro";
  altezza: number;
  peso: number | string;
  massaGrassa: number | string | null;
  massaMagra: number | string | null;
  lavoro: string | null;
  terapie: string | null;
  condizioniMediche: string | null;
  note: string | null;
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
  massaMagra: number;
  massaGrassa: number;
};

export type UpdateClienteInput = {
  indirizzo?: string;
  citta?: string;
  telefono?: string;
  email?: string;
  sesso?: "M" | "F" | "Altro";
  altezza?: number;
  peso?: number;
  massaGrassa?: number;
  massaMagra?: number;
  lavoro?: string;
  terapie?: string;
  condizioniMediche?: string;
  note?: string;
};

type GetAllClientiResponse = {
  id: number;
  nome: string;
  cognome: string;
  data_nascita: string;
  sesso: "M" | "F" | "Altro";
};

type GetClienteByIdResponse = {
  id: number;
  nome: string;
  cognome: string;
  data_nascita: string;
  indirizzo: string | null;
  citta: string | null;
  telefono: string | null;
  email: string;
  sesso: "M" | "F" | "Altro";
  altezza: number;
  peso: number | string;
  massaGrassa: number | string | null;
  massaMagra: number | string | null;
  lavoro: string | null;
  terapie: string | null;
  condizioniMediche: string | null;
  note: string | null;
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

export const getClienteById = async (
  clienteId: number,
): Promise<ClienteDettaglio> => {
  const response = await fetch(`/api/clienti/${clienteId}`);

  if (!response.ok) {
    throw new Error("Errore nel recupero dettaglio cliente");
  }

  const cliente = (await response.json()) as GetClienteByIdResponse;

  return {
    id: cliente.id,
    nome: cliente.nome,
    cognome: cliente.cognome,
    dataNascita: cliente.data_nascita,
    indirizzo: cliente.indirizzo,
    citta: cliente.citta,
    telefono: cliente.telefono,
    email: cliente.email,
    sesso: cliente.sesso,
    altezza: cliente.altezza,
    peso: cliente.peso,
    massaGrassa: cliente.massaGrassa,
    massaMagra: cliente.massaMagra,
    lavoro: cliente.lavoro,
    terapie: cliente.terapie,
    condizioniMediche: cliente.condizioniMediche,
    note: cliente.note,
  };
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

export const updateCliente = async (
  clienteId: number,
  payload: UpdateClienteInput,
): Promise<void> => {
  const response = await fetch(`/api/clienti/${clienteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(errorData?.error ?? "Errore nell'aggiornamento cliente");
  }
};
