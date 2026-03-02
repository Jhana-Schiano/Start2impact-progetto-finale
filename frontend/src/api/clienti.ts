export type Cliente = {
  id: number;
  nome: string;
  cognome: string;
  dataNascita: string;
  sesso: "M" | "F" | "Altro";
};

type ClienteApiResponse = {
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

  const data = (await response.json()) as ClienteApiResponse[];

  return data.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    cognome: cliente.cognome,
    dataNascita: cliente.data_nascita,
    sesso: cliente.sesso,
  }));
};
