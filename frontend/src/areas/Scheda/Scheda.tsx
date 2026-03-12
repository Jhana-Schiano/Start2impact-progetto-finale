import {
  useState,
  type ChangeEvent,
  type FC,
  type SyntheticEvent,
} from "react";
import { HiTrash } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { ALLENAMENTO_GIORNI } from "../../api/allenamenti";
import { BackButton, ErrorState, PrimaryButton } from "../../components/Index";
import NewAllenamentoModal from "./NewAllenamentoModal";
import NewEsercizioModal from "./NewEsercizioModal";
import {
  useCreateAllenamento,
  useCreateEsercizio,
  useDeleteEsercizio,
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
    isSubmitting: isSubmittingAllenamento,
    submitError: submitErrorAllenamento,
    clearSubmitError: clearAllenamentoSubmitError,
    createAllenamento,
  } = useCreateAllenamento();

  const {
    isSubmitting: isSubmittingEsercizio,
    submitError: submitErrorEsercizio,
    clearSubmitError: clearEsercizioSubmitError,
    createEsercizio,
  } = useCreateEsercizio();

  const {
    isSubmitting: isSubmittingDeleteEsercizio,
    submitError: submitErrorDeleteEsercizio,
    clearSubmitError: clearDeleteSubmitError,
    deleteEsercizio,
  } = useDeleteEsercizio();

  const [expandedAllenamentoId, setExpandedAllenamentoId] = useState<
    number | null
  >(null);
  const [isAllenamentoModalOpen, setIsAllenamentoModalOpen] = useState(false);
  const [allenamentoSubmitError, setAllenamentoSubmitError] = useState<
    string | null
  >(null);
  const [newAllenamentoForm, setNewAllenamentoForm] =
    useState<NewAllenamentoFormState>(initialNewAllenamentoFormState);
  const [targetAllenamentoId, setTargetAllenamentoId] = useState<number | null>(
    null,
  );

  const [isEsercizioModalOpen, setIsEsercizioModalOpen] = useState(false);
  const [esercizioSubmitError, setEsercizioSubmitError] = useState<
    string | null
  >(null);
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
        <ErrorState message={error ?? "Impossibile mostrare la scheda."} />
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
    clearAllenamentoSubmitError();
    setAllenamentoSubmitError(null);
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
    setAllenamentoSubmitError(null);

    const durata = Number(newAllenamentoForm.durataStimata);
    const aree = newAllenamentoForm.areeCoinvolte.trim();

    if (!Number.isFinite(durata) || durata <= 0) {
      setAllenamentoSubmitError(
        "Durata deve essere un numero maggiore di zero",
      );
      return;
    }

    if (aree === "") {
      setAllenamentoSubmitError("Aree coinvolte è obbligatorio");
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
    clearEsercizioSubmitError();
    setEsercizioSubmitError(null);
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
    setEsercizioSubmitError(null);

    if (!targetAllenamentoId) {
      setEsercizioSubmitError("Allenamento non valido");
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
      setEsercizioSubmitError("Nome e obbligatorio");
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
      setEsercizioSubmitError(
        "Numero serie, ripetizioni e riposo devono essere maggiori di zero",
      );
      return;
    }

    if (volume !== null && (!Number.isFinite(volume) || volume <= 0)) {
      setEsercizioSubmitError(
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

  const handleDeleteEsercizio = async (esercizioId: number) => {
    clearDeleteSubmitError();
    await deleteEsercizio(esercizioId);
    await reload();
  };

  return (
    <section className="panel reveal">
      <div className="scheda-header">
        <div className="scheda-header-left">
          <BackButton />

          <h1 className="section-title">Scheda {scheda.id}</h1>
        </div>

        <div className="scheda-actions">
          <PrimaryButton type="button" onClick={openAllenamentoModal}>
            Nuovo allenamento
          </PrimaryButton>
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
                              <th scope="col" className="scheda-action-col">
                                Azioni
                              </th>
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
                                <td className="scheda-action-col">
                                  <button
                                    type="button"
                                    className="scheda-delete-ex-btn"
                                    aria-label={`Elimina esercizio ${esercizio.nome}`}
                                    title="Elimina esercizio"
                                    disabled={isSubmittingDeleteEsercizio}
                                    onClick={() =>
                                      handleDeleteEsercizio(esercizio.id)
                                    }
                                  >
                                    <HiTrash aria-hidden="true" size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {submitErrorDeleteEsercizio && (
                      <ErrorState message={submitErrorDeleteEsercizio} />
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
        isSubmitting={isSubmittingAllenamento}
        submitError={allenamentoSubmitError ?? submitErrorAllenamento}
        formState={newAllenamentoForm}
        onChange={handleAllenamentoFieldChange}
        onSubmit={handleCreateAllenamento}
        onClose={() => setIsAllenamentoModalOpen(false)}
      />

      <NewEsercizioModal
        isOpen={isEsercizioModalOpen}
        isSubmitting={isSubmittingEsercizio}
        submitError={esercizioSubmitError ?? submitErrorEsercizio}
        formState={newEsercizioForm}
        onChange={handleEsercizioFieldChange}
        onSubmit={handleCreateEsercizio}
        onClose={() => setIsEsercizioModalOpen(false)}
      />
    </section>
  );
};

export default Scheda;
