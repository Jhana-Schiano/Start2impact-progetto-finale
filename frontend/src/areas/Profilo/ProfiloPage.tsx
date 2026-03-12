import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type SyntheticEvent,
} from "react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import useLogout from "../../auth/useLogout";
import useRequiredUserId from "../../auth/useRequiredUserId";
import {
  getUtenteById,
  updateUtenteContatti,
  type Utente,
} from "../../api/utenti";
import { ErrorState, PrimaryButton } from "../../components/Index";
import "./ProfiloPage.css";

const ProfiloPage: FC = () => {
  const userId = useRequiredUserId();
  const handleLogout = useLogout();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const [draftTelefono, setDraftTelefono] = useState("");
  const [isSavingContacts, setIsSavingContacts] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const loadProfilo = useCallback(async () => {
    if (!userId) {
      setUtente(null);
      setError("Effettua il login per visualizzare il profilo");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getUtenteById(userId);
      setUtente(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfilo();
  }, [loadProfilo]);

  const fields = useMemo(() => {
    if (!utente) {
      return [];
    }

    return [
      { label: "ID", value: String(utente.id) },
      { label: "Email", value: utente.email },
      { label: "Telefono", value: utente.telefono ?? "—" },
      {
        label: "Data nascita",
        value: utente.dataNascita
          ? new Date(utente.dataNascita).toLocaleDateString("it-IT")
          : "—",
      },
      { label: "Sesso", value: utente.sesso ?? "—" },
      {
        label: "Creato il",
        value: utente.createdAt
          ? new Date(utente.createdAt).toLocaleString("it-IT")
          : "—",
      },
      {
        label: "Aggiornato il",
        value: utente.updatedAt
          ? new Date(utente.updatedAt).toLocaleString("it-IT")
          : "—",
      },
    ];
  }, [utente]);

  const handleOpenEditModal = () => {
    if (!utente) {
      return;
    }

    setDraftEmail(utente.email);
    setDraftTelefono(utente.telefono ?? "");
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "email") {
      setDraftEmail(value);
      return;
    }

    setDraftTelefono(value);
  };

  const handleCloseEditModal = () => {
    if (isSavingContacts) {
      return;
    }

    setIsEditModalOpen(false);
    setEditError(null);
  };

  const handleSubmitContacts = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedEmail = draftEmail.trim();
    const trimmedTelefono = draftTelefono.trim();

    if (!trimmedEmail && !trimmedTelefono) {
      setEditError("Inserisci almeno email o telefono");
      return;
    }

    try {
      if (!userId) {
        setEditError("Sessione non valida, effettua di nuovo il login");
        return;
      }

      setIsSavingContacts(true);
      setEditError(null);

      await updateUtenteContatti(userId, {
        email: trimmedEmail || undefined,
        telefono: trimmedTelefono || undefined,
      });

      await loadProfilo();
      setIsEditModalOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setIsSavingContacts(false);
    }
  };

  return (
    <section className="panel profilo-section reveal">
      <header className="profilo-header">
        <h1 className="section-title">
          {utente ? `${utente.nome} ${utente.cognome}` : "Profilo"}
        </h1>
      </header>

      {isLoading && <p className="muted">Caricamento profilo...</p>}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && utente && (
        <div className="profilo-grid" aria-label="Dati profilo utente">
          {fields.map((field) => (
            <article key={field.label} className="profilo-card">
              <h2 className="profilo-label">{field.label}</h2>
              <p className="profilo-value">{field.value}</p>
            </article>
          ))}
        </div>
      )}

      <div className="profilo-actions">
        <PrimaryButton
          type="button"
          onClick={handleOpenEditModal}
          disabled={!utente}
        >
          Modifica
        </PrimaryButton>
        <button
          type="button"
          className="btn btn--ghost profilo-logout-btn"
          title="Logout"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <HiArrowRightOnRectangle size={24} />
          Logout
        </button>
      </div>

      {isEditModalOpen && (
        <div className="profilo-modal-overlay" onClick={handleCloseEditModal}>
          <div
            className="profilo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profilo-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profilo-modal-header">
              <h2 id="profilo-edit-title" className="profilo-modal-title">
                Modifica contatti
              </h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleCloseEditModal}
                disabled={isSavingContacts}
              >
                Chiudi
              </button>
            </div>

            <form
              className="profilo-modal-form"
              onSubmit={handleSubmitContacts}
            >
              <label className="profilo-modal-field">
                Email
                <input
                  name="email"
                  type="email"
                  value={draftEmail}
                  onChange={handleChange}
                  disabled={isSavingContacts}
                />
              </label>

              <label className="profilo-modal-field">
                Telefono
                <input
                  name="telefono"
                  type="text"
                  value={draftTelefono}
                  onChange={handleChange}
                  disabled={isSavingContacts}
                />
              </label>

              {editError && <p className="error-text">{editError}</p>}

              <div className="profilo-modal-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={handleCloseEditModal}
                  disabled={isSavingContacts}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={isSavingContacts}
                >
                  {isSavingContacts ? "Salvataggio..." : "Salva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfiloPage;
