import { useCallback, useEffect, useState, type FC } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { getClienteById, type ClienteDettaglio } from "../../api/clienti";
import { BackButton, ErrorState } from "../../components/Index";
import "./DettaglioClientePage.css";

const CLIENTE_ERROR_MESSAGE = "Impossibile caricare il cliente";

export type DettaglioClienteContext = {
  clienteId: number;
  cliente: ClienteDettaglio | null;
  isLoadingCliente: boolean;
  errorCliente: string | null;
  reloadCliente: () => Promise<void>;
};

const DettaglioClientePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);
  const [cliente, setCliente] = useState<ClienteDettaglio | null>(null);
  const [isLoadingCliente, setIsLoadingCliente] = useState(true);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);

  const loadCliente = useCallback(async () => {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      setCliente(null);
      setErrorCliente(CLIENTE_ERROR_MESSAGE);
      setIsLoadingCliente(false);
      return;
    }

    try {
      setIsLoadingCliente(true);
      setErrorCliente(null);
      const response = await getClienteById(clienteId);
      setCliente(response);
    } catch {
      setCliente(null);
      setErrorCliente(CLIENTE_ERROR_MESSAGE);
    } finally {
      setIsLoadingCliente(false);
    }
  }, [clienteId]);

  useEffect(() => {
    loadCliente();
  }, [loadCliente]);

  const clienteTitolo = isLoadingCliente
    ? "Caricamento cliente..."
    : errorCliente
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

      {!errorCliente && (
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
        {errorCliente ? (
          <ErrorState message={errorCliente} className="detail-placeholder" />
        ) : (
          <Outlet
            context={{
              clienteId,
              cliente,
              isLoadingCliente,
              errorCliente,
              reloadCliente: loadCliente,
            }}
          />
        )}
      </div>
    </section>
  );
};

export default DettaglioClientePage;
