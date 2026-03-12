import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCliente,
  getAllClienti,
  type Cliente,
  type CreateClienteInput,
} from "../../api/clienti";
import { PrimaryButton } from "../../components/Index";
import CreateClienteModal from "./CreateClienteModal";
import "./ClientiPage.css";

const ClientiPage: FC = () => {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadClienti = async () => {
    try {
      const response = await getAllClienti();
      setClienti(response);
      setError(null);
    } catch (err) {
      //TODO: Mostrare il messaggio di errore, ma anche una icona o qualcosa di più visibile e centrato(component ad hoc)
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClienti();
  }, []);

  const handleCreateCliente = async (payload: CreateClienteInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createCliente(payload);
      setIsModalOpen(false);
      setIsLoading(true);
      await loadClienti();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToClienteDettaglio = (clienteId: number) => {
    navigate(`/clienti/${clienteId}`);
  };

  return (
    <section className="panel clienti-section reveal">
      <header className="clienti-header">
        <h1 className="section-title">Clienti</h1>
        <PrimaryButton type="button" onClick={() => setIsModalOpen(true)}>
          Nuovo cliente
        </PrimaryButton>
      </header>

      {isLoading && <p className="muted">Caricamento clienti...</p>}

      <div className="clienti-table-wrapper" aria-label="Tabella clienti">
        <table className="clienti-table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Cognome</th>
              <th scope="col">Data nascita</th>
              <th scope="col">Sesso</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && !error && clienti.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  Nessun cliente trovato.
                </td>
              </tr>
            )}

            {clienti.map((cliente) => (
              <tr
                key={cliente.id}
                className="clienti-row-clickable"
                onClick={() => goToClienteDettaglio(cliente.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    goToClienteDettaglio(cliente.id);
                  }
                }}
                aria-label={`Apri dettaglio cliente ${cliente.nome} ${cliente.cognome}`}
              >
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cognome}</td>
                <td>
                  {new Date(cliente.dataNascita).toLocaleDateString("it-IT")}
                </td>
                <td>{cliente.sesso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="muted">{error}</p>}
      {isModalOpen && (
        <CreateClienteModal
          isOpen={isModalOpen}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onClose={() => {
            if (!isSubmitting) {
              setSubmitError(null);
              setIsModalOpen(false);
            }
          }}
          onSubmit={handleCreateCliente}
        />
      )}
    </section>
  );
};

export default ClientiPage;
