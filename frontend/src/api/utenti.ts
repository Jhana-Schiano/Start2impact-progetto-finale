export type Utente = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string | null;
  dataNascita?: string | null;
  sesso?: "M" | "F" | "Altro" | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUtenteContattiInput = {
  email?: string;
  telefono?: string;
};

type UtenteApiResponse = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string | null;
  dataNascita?: string | null;
  sesso?: "M" | "F" | "Altro" | null;
  createdAt?: string;
  updatedAt?: string;
};

export const getUtenteById = async (id: number): Promise<Utente> => {
  const response = await fetch(`/api/utenti/${id}`);

  if (!response.ok) {
    throw new Error("Errore nel recupero del profilo utente");
  }

  const data = (await response.json()) as UtenteApiResponse;

  return {
    id: data.id,
    nome: data.nome,
    cognome: data.cognome,
    email: data.email,
    telefono: data.telefono,
    dataNascita: data.dataNascita,
    sesso: data.sesso,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const updateUtenteContatti = async (
  id: number,
  payload: UpdateUtenteContattiInput,
): Promise<void> => {
  const response = await fetch(`/api/utenti/${id}/contatti`, {
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

    throw new Error(errorData?.error ?? "Errore nell'aggiornamento contatti");
  }
};
