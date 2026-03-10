import {
  useEffect,
  useState,
  type ChangeEvent,
  type FC,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import "./CreateClienteModal.css";

export type ClienteFormValues = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  sesso: "M" | "F" | "Altro";
  dataNascita: string;
  altezza: number;
  peso: number;
  massaMagra: number;
  massaGrassa: number;
  terapie: string;
  condizioniMediche: string;
  note: string;
  lavoro: string;
};

type ClienteFormModalProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (values: ClienteFormValues) => Promise<void>;
  initialValues?: Partial<ClienteFormValues>;
  title: string;
  submitLabel: string;
};

const defaultFormValues: ClienteFormValues = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  indirizzo: "",
  citta: "",
  sesso: "M",
  dataNascita: "",
  altezza: 0,
  peso: 0,
  massaMagra: 0,
  massaGrassa: 0,
  terapie: "",
  condizioniMediche: "",
  note: "",
  lavoro: "",
};

const mergeFormValues = (
  initialValues?: Partial<ClienteFormValues>,
): ClienteFormValues => ({
  ...defaultFormValues,
  ...initialValues,
});

const ClienteFormModal: FC<ClienteFormModalProps> = ({
  mode,
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
  initialValues,
  title,
  submitLabel,
}) => {
  const [formState, setFormState] = useState<ClienteFormValues>(() =>
    mergeFormValues(initialValues),
  );
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, isSubmitting, onClose]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormState((previous) => {
      if (name === "altezza" || name === "peso") {
        return {
          ...previous,
          [name]: value === "" ? 0 : Number(value),
        };
      }

      if (name === "massaMagra" || name === "massaGrassa") {
        return {
          ...previous,
          [name]: value === "" ? 0 : Number(value),
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  const canGoNext =
    formState.nome.trim() !== "" &&
    formState.cognome.trim() !== "" &&
    formState.email.trim() !== "";

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div
        className="modal"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="cliente-modal-title" className="modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Chiudi
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === "create" && step === 1 ? (
            <>
              <label className="modal-field">
                Nome
                <input
                  name="nome"
                  type="text"
                  value={formState.nome}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Cognome
                <input
                  name="cognome"
                  type="text"
                  value={formState.cognome}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Email
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Telefono
                <input
                  name="telefono"
                  type="text"
                  value={formState.telefono}
                  onChange={handleChange}
                />
              </label>

              <fieldset className="modal-field modal-field--full">
                <legend>Sesso</legend>
                <label>
                  <input
                    type="radio"
                    name="sesso"
                    value="M"
                    checked={formState.sesso === "M"}
                    onChange={handleChange}
                  />
                  M
                </label>
                <label>
                  <input
                    type="radio"
                    name="sesso"
                    value="F"
                    checked={formState.sesso === "F"}
                    onChange={handleChange}
                  />
                  F
                </label>
                <label>
                  <input
                    type="radio"
                    name="sesso"
                    value="Altro"
                    checked={formState.sesso === "Altro"}
                    onChange={handleChange}
                  />
                  Altro
                </label>
              </fieldset>

              <label className="modal-field">
                Indirizzo
                <input
                  name="indirizzo"
                  type="text"
                  value={formState.indirizzo}
                  onChange={handleChange}
                />
              </label>

              <label className="modal-field">
                Città
                <input
                  name="citta"
                  type="text"
                  value={formState.citta}
                  onChange={handleChange}
                />
              </label>
            </>
          ) : (
            <>
              {mode === "create" && (
                <label className="modal-field">
                  Data nascita
                  <input
                    name="dataNascita"
                    type="date"
                    value={formState.dataNascita}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}

              {mode === "edit" && (
                <>
                  <label className="modal-field">
                    Email
                    <input
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="modal-field">
                    Telefono
                    <input
                      name="telefono"
                      type="text"
                      value={formState.telefono}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="modal-field">
                    Indirizzo
                    <input
                      name="indirizzo"
                      type="text"
                      value={formState.indirizzo}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="modal-field">
                    Città
                    <input
                      name="citta"
                      type="text"
                      value={formState.citta}
                      onChange={handleChange}
                    />
                  </label>

                  <fieldset className="modal-field modal-field--full">
                    <legend>Sesso</legend>
                    <label>
                      <input
                        type="radio"
                        name="sesso"
                        value="M"
                        checked={formState.sesso === "M"}
                        onChange={handleChange}
                      />
                      M
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="sesso"
                        value="F"
                        checked={formState.sesso === "F"}
                        onChange={handleChange}
                      />
                      F
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="sesso"
                        value="Altro"
                        checked={formState.sesso === "Altro"}
                        onChange={handleChange}
                      />
                      Altro
                    </label>
                  </fieldset>
                </>
              )}

              <label className="modal-field">
                Altezza (cm)
                <input
                  name="altezza"
                  type="number"
                  min={1}
                  step={1}
                  value={formState.altezza || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Peso (kg)
                <input
                  name="peso"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={formState.peso || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Massa magra (kg)
                <input
                  name="massaMagra"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={formState.massaMagra || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field">
                Massa grassa (kg)
                <input
                  name="massaGrassa"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={formState.massaGrassa || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="modal-field modal-field--full">
                Terapie
                <textarea
                  name="terapie"
                  value={formState.terapie}
                  onChange={handleChange}
                  rows={3}
                />
              </label>

              <label className="modal-field modal-field--full">
                Condizioni mediche
                <textarea
                  name="condizioniMediche"
                  value={formState.condizioniMediche}
                  onChange={handleChange}
                  rows={3}
                />
              </label>

              <label className="modal-field modal-field--full">
                Lavoro
                <textarea
                  name="lavoro"
                  value={formState.lavoro}
                  onChange={handleChange}
                  rows={3}
                />
              </label>

              <label className="modal-field modal-field--full">
                Note
                <textarea
                  name="note"
                  value={formState.note}
                  onChange={handleChange}
                  rows={3}
                />
              </label>
            </>
          )}

          {submitError && <p className="muted">{submitError}</p>}

          <div className="modal-actions">
            {mode === "create" && step === 2 && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Indietro
              </button>
            )}

            {mode === "create" && step === 1 ? (
              <button
                type="button"
                className="btn"
                onClick={() => setStep(2)}
                disabled={!canGoNext || isSubmitting}
              >
                Avanti
              </button>
            ) : (
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default ClienteFormModal;
