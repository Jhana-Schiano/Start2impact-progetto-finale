import { useCallback, useEffect, useState, type FC } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { getClienteById, type ClienteDettaglio } from "../../api/clienti";
import { BackButton, ErrorState } from "../../components/Index";
import "./DettaglioClientePage.css";

const CLIENTE_ERROR_MESSAGE = "Impossibile caricare il cliente";

export type DettaglioClienteContext = {
  clienteId: number;
  cliente: ClienteDettaglio | null;
  isLoading: boolean;
  error: string | null;
  reloadCliente: () => Promise<void>;
};

const DettaglioClientePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);
  const [cliente, setCliente] = useState<ClienteDettaglio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCliente = useCallback(async () => {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      setCliente(null);
      setError(CLIENTE_ERROR_MESSAGE);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getClienteById(clienteId);
      setCliente(response);
    } catch {
      setCliente(null);
      setError(CLIENTE_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    loadCliente();
  }, [loadCliente]);

  const clienteTitolo = isLoading
    ? "Caricamento cliente..."
    : error
      ? "Cliente non disponibile"
      : cliente
        ? `${cliente.id} - ${cliente.nome} ${cliente.cognome} (${cliente.sesso}) ${new Date(cliente.dataNascita).toLocaleDateString("it-IT")}`
        : "Cliente";

  return (
    <section className="panel detail-page reveal">
      <header className="detail-header">
        <div className="detail-header-top">
          <BackButton to="/clienti" />
          <h1 className="section-title">{clienteTitolo}</h1>
        </div>
      </header>

      {!error && (
        <nav className="detail-tabs" aria-label="Navigazione dettaglio cliente">
          <NavLink
            to="dati"
            className={({ isActive }) =>
              `detail-tab${isActive ? " detail-tab-active" : ""}`
            }
          >
            Dati
          </NavLink>
          <NavLink
            to="schede"
            className={({ isActive }) =>
              `detail-tab${isActive ? " detail-tab-active" : ""}`
            }
          >
            Schede
          </NavLink>
        </nav>
      )}

      <div className="detail-content">
        {error ? (
          <ErrorState message={error} className="detail-placeholder" />
        ) : (
          <Outlet
            context={{
              clienteId,
              cliente,
              isLoading,
              error,
              reloadCliente: loadCliente,
            }}
          />
        )}
      </div>
    </section>
  );
};

export default DettaglioClientePage;
