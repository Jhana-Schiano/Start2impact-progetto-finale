import { useEffect, useState, type FC } from "react";
import { getSchedeByClienteId, type Scheda } from "../../api/schede";
import { useOutletContext } from "react-router-dom";
import type { DettaglioClienteContext } from "./DettaglioClientePage";

const SchedeClienteTab: FC = () => {
  const { clienteId, errorCliente, isLoadingCliente } =
    useOutletContext<DettaglioClienteContext>();
  const [schede, setSchede] = useState<Scheda[]>([]);
  const [isLoadingSchede, setIsLoadingSchede] = useState(true);
  const [errorSchede, setErrorSchede] = useState<string | null>(null);

  useEffect(() => {
    if (isLoadingCliente || errorCliente) {
      setIsLoadingSchede(false);
      return;
    }

    const loadSchede = async () => {
      try {
        setIsLoadingSchede(true);
        const response = await getSchedeByClienteId(clienteId);
        setSchede(response);
        setErrorSchede(null);
      } catch (error) {
        setErrorSchede(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento schede cliente",
        );
      } finally {
        setIsLoadingSchede(false);
      }
    };

    loadSchede();
  }, [clienteId, errorCliente, isLoadingCliente]);

  if (isLoadingCliente || isLoadingSchede) {
    return <p className="muted">Caricamento schede...</p>;
  }

  if (errorCliente) {
    return (
      <p className="error-text">Impossibile mostrare le schede cliente.</p>
    );
  }

  if (errorSchede) {
    return <p className="error-text">{errorSchede}</p>;
  }

  if (schede.length === 0) {
    return <p className="muted">Nessuna scheda associata a questo cliente.</p>;
  }

  return (
    <ul className="schede-list">
      {schede.map((scheda) => (
        <li key={scheda.id} className="schede-item">
          <h3>{scheda.titolo}</h3>
          <p className="muted">
            {new Date(scheda.dataInizio).toLocaleDateString("it-IT")} -{" "}
            {new Date(scheda.dataFine).toLocaleDateString("it-IT")}
          </p>
          <p>{scheda.obiettivo}</p>
        </li>
      ))}
    </ul>
  );
};

export default SchedeClienteTab;
