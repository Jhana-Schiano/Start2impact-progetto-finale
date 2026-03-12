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
import {
  createScheda,
  getSchedeByClienteId,
  type Scheda,
} from "../../api/schede";
import ModalBase from "../../components/Modal/ModalBase";
import { PrimaryButton } from "../../components/Index";
import { useAppSelector } from "../../store/hooks";
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
  const { clienteId, errorCliente, isLoadingCliente } =
    useOutletContext<DettaglioClienteContext>();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);
  const [schede, setSchede] = useState<Scheda[]>([]);
  const [isLoadingSchede, setIsLoadingSchede] = useState(true);
  const [errorSchede, setErrorSchede] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingScheda, setIsCreatingScheda] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newSchedaForm, setNewSchedaForm] = useState<NewSchedaFormState>(
    initialSchedaFormState,
  );

  const loadSchede = useCallback(async () => {
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
  }, [clienteId]);

  useEffect(() => {
    if (isLoadingCliente || errorCliente) {
      setIsLoadingSchede(false);
      return;
    }

    loadSchede();
  }, [errorCliente, isLoadingCliente, loadSchede]);

  const sortedSchede = useMemo(
    () =>
      [...schede].sort(
        (a, b) =>
          new Date(b.dataInizio).getTime() - new Date(a.dataInizio).getTime(),
      ),
    [schede],
  );

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

  const handleOpenCreateModal = () => {
    setCreateError(null);
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
      setIsCreatingScheda(true);
      setCreateError(null);

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
      setCreateError(
        error instanceof Error
          ? error.message
          : "Errore durante la creazione della scheda",
      );
    } finally {
      setIsCreatingScheda(false);
    }
  };

  const handleCloseCreateModal = () => {
    if (!isCreatingScheda) {
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
        closeOnEscape={!isCreatingScheda}
        closeOnOverlayClick={!isCreatingScheda}
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
            disabled={isCreatingScheda}
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

          {createError && <p className="error-text">{createError}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCloseCreateModal}
              disabled={isCreatingScheda}
            >
              Annulla
            </button>
            <button type="submit" className="btn" disabled={isCreatingScheda}>
              {isCreatingScheda ? "Salvataggio..." : "Crea scheda"}
            </button>
          </div>
        </form>
      </ModalBase>
    </>
  );
};

export default SchedeClienteTab;
