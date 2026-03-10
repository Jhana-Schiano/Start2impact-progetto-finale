import { useEffect, useState, type FC } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { getClienteById, type ClienteDettaglio } from "../../api/clienti";
import "./DettaglioClientePage.css";

export type DettaglioClienteContext = {
  clienteId: number;
  cliente: ClienteDettaglio | null;
  isLoadingCliente: boolean;
  errorCliente: string | null;
};

const DettaglioClientePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);
  const [cliente, setCliente] = useState<ClienteDettaglio | null>(null);
  const [isLoadingCliente, setIsLoadingCliente] = useState(true);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      setErrorCliente("Id cliente non valido");
      setIsLoadingCliente(false);
      return;
    }

    const loadCliente = async () => {
      try {
        setIsLoadingCliente(true);
        const response = await getClienteById(clienteId);
        setCliente(response);
        setErrorCliente(null);
      } catch (error) {
        setErrorCliente(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento cliente",
        );
      } finally {
        setIsLoadingCliente(false);
      }
    };

    loadCliente();
  }, [clienteId]);

  const clienteTitolo = isLoadingCliente
    ? "Caricamento cliente..."
    : cliente
      ? `${cliente.id} - ${cliente.nome} ${cliente.cognome} (${cliente.sesso}) ${new Date(cliente.dataNascita).toLocaleDateString("it-IT")}`
      : "Cliente";

  return (
    <section className="panel detail-page reveal">
      <header className="detail-header">
        <h1 className="section-title">{clienteTitolo}</h1>
        {errorCliente && <p className="error-text">{errorCliente}</p>}
      </header>

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

      <div className="detail-content">
        <Outlet
          context={{
            clienteId,
            cliente,
            isLoadingCliente,
            errorCliente,
          }}
        />
      </div>
    </section>
  );
};

export default DettaglioClientePage;
