import {
  useState,
  type ChangeEvent,
  type FC,
  type SyntheticEvent,
} from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { ALLENAMENTO_GIORNI } from "../../api/allenamenti";
import NewAllenamentoModal from "./NewAllenamentoModal";
import NewEsercizioModal from "./NewEsercizioModal";
import {
  useCreateAllenamento,
  useCreateEsercizio,
  useSchedaData,
} from "../../hooks";
import "./Scheda.css";

type NewAllenamentoFormState = {
  giorno: (typeof ALLENAMENTO_GIORNI)[number];
  durataStimata: string;
  areeCoinvolte: string;
};

type NewEsercizioFormState = {
  nome: string;
  attrezzo: string;
  numeroSerie: string;
  ripetizioni: string;
  riposo: string;
  volume: string;
};

const initialNewAllenamentoFormState: NewAllenamentoFormState = {
  giorno: "Lunedi",
  durataStimata: "",
  areeCoinvolte: "",
};

const initialNewEsercizioFormState: NewEsercizioFormState = {
  nome: "",
  attrezzo: "",
  numeroSerie: "",
  ripetizioni: "",
  riposo: "",
  volume: "",
};

const Scheda: FC = () => {
  const navigate = useNavigate();
  const { id, schedaId } = useParams<{ id: string; schedaId: string }>();
  const {
    scheda,
    sortedAllenamenti,
    eserciziByAllenamento,
    isLoading,
    error,
    reload,
  } = useSchedaData({ clienteIdParam: id, schedaIdParam: schedaId });

  const {
    isCreatingAllenamento,
    createAllenamentoError,
    clearCreateAllenamentoError,
    createAllenamento,
  } = useCreateAllenamento();

  const {
    isCreatingEsercizio,
    createEsercizioError,
    clearCreateEsercizioError,
    createEsercizio,
  } = useCreateEsercizio();

  const [expandedAllenamentoId, setExpandedAllenamentoId] = useState<
    number | null
  >(null);
  const [isAllenamentoModalOpen, setIsAllenamentoModalOpen] = useState(false);
  const [allenamentoFormError, setAllenamentoFormError] = useState<
    string | null
  >(null);
  const [newAllenamentoForm, setNewAllenamentoForm] =
    useState<NewAllenamentoFormState>(initialNewAllenamentoFormState);
  const [targetAllenamentoId, setTargetAllenamentoId] = useState<number | null>(
    null,
  );
  const [isEsercizioModalOpen, setIsEsercizioModalOpen] = useState(false);
  const [esercizioFormError, setEsercizioFormError] = useState<string | null>(
    null,
  );
  const [newEsercizioForm, setNewEsercizioForm] =
    useState<NewEsercizioFormState>(initialNewEsercizioFormState);

  const activeAllenamentoId =
    expandedAllenamentoId != null &&
    sortedAllenamenti.some(
      (allenamento) => allenamento.id === expandedAllenamentoId,
    )
      ? expandedAllenamentoId
      : (sortedAllenamenti[0]?.id ?? null);

  if (isLoading) {
    return (
      <section className="panel reveal">
        <p className="muted">Caricamento scheda...</p>
      </section>
    );
  }

  if (error || !scheda) {
    return (
      <section className="panel reveal">
        <p className="error-text">
          {error ?? "Impossibile mostrare la scheda."}
        </p>
      </section>
    );
  }

  const dateRange = `${new Date(scheda.dataInizio).toLocaleDateString("it-IT")} - ${new Date(scheda.dataFine).toLocaleDateString("it-IT")}`;

  const toggleAllenamento = (allenamentoId: number) => {
    setExpandedAllenamentoId(
      activeAllenamentoId === allenamentoId ? null : allenamentoId,
    );
  };

  const openAllenamentoModal = () => {
    clearCreateAllenamentoError();
    setAllenamentoFormError(null);
    setNewAllenamentoForm(initialNewAllenamentoFormState);
    setIsAllenamentoModalOpen(true);
  };

  const handleAllenamentoFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setNewAllenamentoForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateAllenamento = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setAllenamentoFormError(null);

    const durata = Number(newAllenamentoForm.durataStimata);
    const aree = newAllenamentoForm.areeCoinvolte.trim();

    if (!Number.isFinite(durata) || durata <= 0) {
      setAllenamentoFormError("Durata deve essere un numero maggiore di zero");
      return;
    }

    if (aree === "") {
      setAllenamentoFormError("Aree coinvolte è obbligatorio");
      return;
    }

    const createdAllenamentoId = await createAllenamento({
      schedaId: scheda.id,
      durataStimata: durata,
      areeCoinvolte: aree,
      giorno: newAllenamentoForm.giorno,
    });

    await reload();
    setExpandedAllenamentoId(createdAllenamentoId);
    setIsAllenamentoModalOpen(false);
  };

  const openEsercizioModal = (allenamentoId: number) => {
    setTargetAllenamentoId(allenamentoId);
    clearCreateEsercizioError();
    setEsercizioFormError(null);
    setNewEsercizioForm(initialNewEsercizioFormState);
    setIsEsercizioModalOpen(true);
  };

  const handleEsercizioFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setNewEsercizioForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateEsercizio = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setEsercizioFormError(null);

    if (!targetAllenamentoId) {
      setEsercizioFormError("Allenamento non valido");
      return;
    }

    const nome = newEsercizioForm.nome.trim();
    const rawAttrezzo = newEsercizioForm.attrezzo.trim();
    const attrezzo = rawAttrezzo === "" ? null : rawAttrezzo;
    const numeroSerie = Number(newEsercizioForm.numeroSerie);
    const ripetizioni = Number(newEsercizioForm.ripetizioni);
    const riposo = Number(newEsercizioForm.riposo);
    const rawVolume = newEsercizioForm.volume.trim();
    const volume = rawVolume === "" ? null : Number(rawVolume);

    if (nome === "") {
      setEsercizioFormError("Nome e obbligatorio");
      return;
    }

    if (
      !Number.isFinite(numeroSerie) ||
      !Number.isFinite(ripetizioni) ||
      !Number.isFinite(riposo) ||
      numeroSerie <= 0 ||
      ripetizioni <= 0 ||
      riposo <= 0
    ) {
      setEsercizioFormError(
        "Numero serie, ripetizioni e riposo devono essere maggiori di zero",
      );
      return;
    }

    if (volume !== null && (!Number.isFinite(volume) || volume <= 0)) {
      setEsercizioFormError(
        "Volume deve essere maggiore di zero quando valorizzato",
      );
      return;
    }

    await createEsercizio({
      nome,
      attrezzo,
      allenamentoId: targetAllenamentoId,
      numeroSerie,
      ripetizioni,
      riposo,
      volume,
    });

    await reload();
    setExpandedAllenamentoId(targetAllenamentoId);
    setIsEsercizioModalOpen(false);
    setTargetAllenamentoId(null);
  };

  return (
    <section className="panel reveal">
      <div className="scheda-header">
        <div className="scheda-header-left">
          <span
            className="scheda-back-icon"
            role="button"
            tabIndex={0}
            onClick={() => navigate(-1)}
            aria-label="Indietro"
            title="Indietro"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(-1);
              }
            }}
          >
            <HiArrowLeft aria-hidden="true" size={16} />
          </span>

          <h1 className="section-title">Scheda {scheda.id}</h1>
        </div>

        <div className="scheda-actions">
          <button type="button" className="btn" onClick={openAllenamentoModal}>
            Nuovo allenamento
          </button>
        </div>
      </div>

      <p className="muted scheda-date-range">{dateRange}</p>

      {sortedAllenamenti.length === 0 ? (
        <p className="muted">Nessun allenamento presente in questa scheda.</p>
      ) : (
        <div className="scheda-allenamenti-list">
          {sortedAllenamenti.map((allenamento, index) => {
            const isExpanded = activeAllenamentoId === allenamento.id;
            const eserciziAllenamento =
              eserciziByAllenamento.get(allenamento.id) ?? [];

            return (
              <article key={allenamento.id} className="scheda-allenamento-card">
                <button
                  type="button"
                  className="scheda-allenamento-toggle"
                  onClick={() => toggleAllenamento(allenamento.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="scheda-allenamento-heading">
                    Allenamento {index + 1} - {allenamento.giorno}
                  </span>
                  <span className="scheda-allenamento-meta muted">
                    {allenamento.durataStimata} min -{" "}
                    {allenamento.areeCoinvolte}
                  </span>
                  <span className="scheda-allenamento-count muted">
                    {eserciziAllenamento.length} esercizi
                  </span>
                </button>

                {isExpanded && (
                  <div className="scheda-allenamento-body">
                    {eserciziAllenamento.length === 0 ? (
                      <p className="muted">
                        Nessun esercizio in questo allenamento.
                      </p>
                    ) : (
                      <div className="scheda-table-wrapper">
                        <table className="scheda-table">
                          <thead>
                            <tr>
                              <th scope="col">Nome</th>
                              <th scope="col">Attrezzo</th>
                              <th scope="col">Serie x Ripetizioni</th>
                              <th scope="col">Riposo</th>
                              <th scope="col">Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eserciziAllenamento.map((esercizio) => (
                              <tr key={esercizio.id}>
                                <td>{esercizio.nome}</td>
                                <td>{esercizio.attrezzo ?? "-"}</td>
                                <td>
                                  {esercizio.numeroSerie}x
                                  {esercizio.ripetizioni}
                                </td>
                                <td>{esercizio.riposo}</td>
                                <td>
                                  {esercizio.volume == null
                                    ? "-"
                                    : `${esercizio.volume} kg`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="scheda-allenamento-actions">
                      <button
                        type="button"
                        className="btn btn--ghost scheda-allenamento-add-btn"
                        onClick={() => openEsercizioModal(allenamento.id)}
                      >
                        Aggiungi esercizio
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <NewAllenamentoModal
        isOpen={isAllenamentoModalOpen}
        isSubmitting={isCreatingAllenamento}
        error={allenamentoFormError ?? createAllenamentoError}
        formState={newAllenamentoForm}
        onChange={handleAllenamentoFieldChange}
        onSubmit={handleCreateAllenamento}
        onClose={() => setIsAllenamentoModalOpen(false)}
      />

      <NewEsercizioModal
        isOpen={isEsercizioModalOpen}
        isSubmitting={isCreatingEsercizio}
        error={esercizioFormError ?? createEsercizioError}
        formState={newEsercizioForm}
        onChange={handleEsercizioFieldChange}
        onSubmit={handleCreateEsercizio}
        onClose={() => setIsEsercizioModalOpen(false)}
      />
    </section>
  );
};

export default Scheda;
