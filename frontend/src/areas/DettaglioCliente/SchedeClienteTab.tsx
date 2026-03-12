import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type SyntheticEvent,
} from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useRequiredUserId from "../../auth/useRequiredUserId";
import {
  createScheda,
  getSchedeByClienteId,
  type Scheda,
} from "../../api/schede";
import { ErrorState, ModalBase, PrimaryButton } from "../../components/Index";
import type { DettaglioClienteContext } from "./DettaglioClientePage";

type NewSchedaFormState = {
  dataInizio: string;
  dataFine: string;
  obiettivo: string;
};

const initialSchedaFormState: NewSchedaFormState = {
  dataInizio: "",
  dataFine: "",
  obiettivo: "",
};

const SchedeClienteTab: FC = () => {
  const {
    clienteId,
    error: parentError,
    isLoading: isParentLoading,
  } = useOutletContext<DettaglioClienteContext>();
  const navigate = useNavigate();
  const userId = useRequiredUserId();
  const [schede, setSchede] = useState<Scheda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newSchedaForm, setNewSchedaForm] = useState<NewSchedaFormState>(
    initialSchedaFormState,
  );

  const loadSchede = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSchedeByClienteId(clienteId);
      setSchede(response);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Errore nel caricamento schede cliente",
      );
    } finally {
      setIsLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (isParentLoading || parentError) {
      setIsLoading(false);
      return;
    }

    loadSchede();
  }, [isParentLoading, parentError, loadSchede]);

  const sortedSchede = useMemo(
    () =>
      [...schede].sort(
        (a, b) =>
          new Date(b.dataInizio).getTime() - new Date(a.dataInizio).getTime(),
      ),
    [schede],
  );

  if (isParentLoading || isLoading) {
    return <p className="muted">Caricamento schede...</p>;
  }

  if (parentError) {
    return <ErrorState message="Impossibile mostrare le schede cliente." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleOpenCreateModal = () => {
    setSubmitError(null);
    setNewSchedaForm(initialSchedaFormState);
    setIsCreateModalOpen(true);
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setNewSchedaForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateScheda = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!userId) {
        throw new Error("Utente non autenticato. Effettua di nuovo il login.");
      }

      const { dataInizio, dataFine, obiettivo } = newSchedaForm;
      const obiettivoText = obiettivo.trim();

      if (!dataInizio || !dataFine || obiettivoText === "") {
        throw new Error("Data inizio, data fine e obiettivo sono obbligatori");
      }

      if (new Date(dataFine).getTime() < new Date(dataInizio).getTime()) {
        throw new Error(
          "La data fine non puo essere precedente alla data inizio",
        );
      }

      await createScheda({
        dataInizio,
        dataFine,
        personalTrainerId: userId,
        obiettivo: obiettivoText,
        clienteId,
      });

      await loadSchede();
      setIsCreateModalOpen(false);
      setNewSchedaForm(initialSchedaFormState);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Errore durante la creazione della scheda",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCreateModal = () => {
    if (!isSubmitting) {
      setIsCreateModalOpen(false);
    }
  };

  return (
    <>
      {schede.length === 0 ? (
        <p className="muted">Nessuna scheda associata a questo cliente.</p>
      ) : (
        <div
          className="schede-table-wrapper"
          aria-label="Tabella schede cliente"
        >
          <table className="schede-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Data inizio</th>
                <th scope="col">Data fine</th>
                <th scope="col">Obiettivo</th>
              </tr>
            </thead>
            <tbody>
              {sortedSchede.map((scheda) => (
                <tr
                  key={scheda.id}
                  className="schede-row-clickable"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/clienti/${clienteId}/schede/${scheda.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/clienti/${clienteId}/schede/${scheda.id}`);
                    }
                  }}
                  aria-label={`Apri dettaglio scheda ${scheda.id}`}
                >
                  <td>{scheda.id}</td>
                  <td>
                    {new Date(scheda.dataInizio).toLocaleDateString("it-IT")}
                  </td>
                  <td>
                    {new Date(scheda.dataFine).toLocaleDateString("it-IT")}
                  </td>
                  <td>{scheda.obiettivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="detail-actions">
        <PrimaryButton type="button" onClick={handleOpenCreateModal}>
          Nuova scheda
        </PrimaryButton>
      </div>

      <ModalBase
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        closeOnEscape={!isSubmitting}
        closeOnOverlayClick={!isSubmitting}
        ariaLabelledBy="new-scheda-title"
      >
        <div className="modal-header">
          <h2 id="new-scheda-title" className="modal-title">
            Nuova scheda
          </h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleCloseCreateModal}
            disabled={isSubmitting}
          >
            Chiudi
          </button>
        </div>

        <form className="modal-form" onSubmit={handleCreateScheda}>
          <label className="modal-field modal-field--full">
            Data inizio
            <input
              name="dataInizio"
              type="date"
              value={newSchedaForm.dataInizio}
              onChange={handleFormChange}
              required
            />
          </label>

          <label className="modal-field modal-field--full">
            Data fine
            <input
              name="dataFine"
              type="date"
              value={newSchedaForm.dataFine}
              onChange={handleFormChange}
              required
            />
          </label>

          <label className="modal-field modal-field--full">
            Obiettivo
            <textarea
              name="obiettivo"
              value={newSchedaForm.obiettivo}
              onChange={handleFormChange}
              rows={4}
              required
            />
          </label>

          {submitError && <p className="error-text">{submitError}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCloseCreateModal}
              disabled={isSubmitting}
            >
              Annulla
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Crea scheda"}
            </button>
          </div>
        </form>
      </ModalBase>
    </>
  );
};

export default SchedeClienteTab;
