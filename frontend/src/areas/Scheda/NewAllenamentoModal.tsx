import type { ChangeEvent, FC, SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { ALLENAMENTO_GIORNI } from "../../api/allenamenti";
import "../Clienti/CreateClienteModal.css";

type NewAllenamentoFormState = {
  giorno: (typeof ALLENAMENTO_GIORNI)[number];
  durataStimata: string;
  areeCoinvolte: string;
};


export interface initialNewAllenamentoFormState extends NewAllenamentoFormState {
  giorno: "Lunedi";
  durataStimata: "";
  areeCoinvolte: "";
};

type NewAllenamentoModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  formState: NewAllenamentoFormState;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  onClose: () => void;
};

const NewAllenamentoModal: FC<NewAllenamentoModalProps> = ({
  isOpen,
  isSubmitting,
  error,
  formState,
  onChange,
  onSubmit,
  onClose,
}) => {
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
        aria-labelledby="new-allenamento-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="new-allenamento-title" className="modal-title">
            Nuovo allenamento
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

        <form className="modal-form" onSubmit={onSubmit}>
          <label className="modal-field modal-field--full">
            Giorno
            <select
              name="giorno"
              value={formState.giorno}
              onChange={onChange}
              required
            >
              {ALLENAMENTO_GIORNI.map((giorno) => (
                <option key={giorno} value={giorno}>
                  {giorno}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-field modal-field--full">
            Durata stimata (minuti)
            <input
              name="durataStimata"
              type="number"
              min={1}
              step={1}
              value={formState.durataStimata}
              onChange={onChange}
              required
            />
          </label>

          <label className="modal-field modal-field--full">
            Aree coinvolte
            <textarea
              name="areeCoinvolte"
              value={formState.areeCoinvolte}
              onChange={onChange}
              rows={3}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annulla
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Crea allenamento"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default NewAllenamentoModal;
