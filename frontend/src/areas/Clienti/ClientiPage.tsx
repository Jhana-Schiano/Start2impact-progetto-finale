import { useEffect, useState, type FC } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import {
  createCliente,
  getAllClienti,
  type ClientiPagination,
  type Cliente,
  type CreateClienteInput,
} from "../../api/clienti";
import { ErrorState, PrimaryButton } from "../../components/Index";
import CreateClienteModal from "./CreateClienteModal";
import "./ClientiPage.css";

const CLIENTI_PER_PAGE = 10;

const initialPagination: ClientiPagination = {
  page: 1,
  limit: CLIENTI_PER_PAGE,
  totalItems: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

const ClientiPage: FC = () => {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [pagination, setPagination] =
    useState<ClientiPagination>(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadClienti = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getAllClienti(page, CLIENTI_PER_PAGE);
      setClienti(response.data);
      setPagination({
        ...response.pagination,
        totalPages: Math.max(1, response.pagination.totalPages),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClienti(currentPage);
  }, [currentPage]);

  const handleCreateCliente = async (payload: CreateClienteInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await createCliente(payload);
      setIsModalOpen(false);
      await loadClienti(currentPage);
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

      {!error && (
        <footer className="clienti-pagination" aria-label="Paginazione clienti">
          <p className="muted clienti-pagination-info">
            Pagina {pagination.page} di {pagination.totalPages} · Totale: {" "}
            {pagination.totalItems}
          </p>

          <div className="clienti-pagination-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={isLoading || !pagination.hasPreviousPage}
              aria-label="Pagina precedente"
              title="Pagina precedente"
            >
              <HiChevronLeft aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={isLoading || !pagination.hasNextPage}
              aria-label="Pagina successiva"
              title="Pagina successiva"
            >
              <HiChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </footer>
      )}

      {error && <ErrorState message={error} />}
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
