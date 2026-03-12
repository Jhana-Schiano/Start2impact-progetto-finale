import type { ChangeEvent, FC, SyntheticEvent } from "react";
import { ModalBase, PrimaryButton } from "../../components/Index";

type NewEsercizioFormState = {
  nome: string;
  attrezzo: string;
  numeroSerie: string;
  ripetizioni: string;
  riposo: string;
  volume: string;
};

type NewEsercizioModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  formState: NewEsercizioFormState;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  onClose: () => void;
};

const NewEsercizioModal: FC<NewEsercizioModalProps> = ({
  isOpen,
  isSubmitting,
  error,
  formState,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
      ariaLabelledBy="new-esercizio-title"
    >
      <div className="modal-header">
        <h2 id="new-esercizio-title" className="modal-title">
          Nuovo esercizio
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
        <label className="modal-field">
          Nome
          <input
            name="nome"
            type="text"
            value={formState.nome}
            onChange={onChange}
            required
          />
        </label>

        <label className="modal-field">
          Attrezzo
          <input
            name="attrezzo"
            type="text"
            value={formState.attrezzo}
            onChange={onChange}
          />
        </label>

        <label className="modal-field">
          Numero serie
          <input
            name="numeroSerie"
            type="number"
            min={1}
            step={1}
            value={formState.numeroSerie}
            onChange={onChange}
            required
          />
        </label>

        <label className="modal-field">
          Ripetizioni
          <input
            name="ripetizioni"
            type="number"
            min={1}
            step={1}
            value={formState.ripetizioni}
            onChange={onChange}
            required
          />
        </label>

        <label className="modal-field">
          Riposo (sec)
          <input
            name="riposo"
            type="number"
            min={1}
            step={1}
            value={formState.riposo}
            onChange={onChange}
            required
          />
        </label>

        <label className="modal-field">
          Volume (kg, opzionale)
          <input
            name="volume"
            type="number"
            min={1}
            step={1}
            value={formState.volume}
            onChange={onChange}
          />
        </label>

        {error && <p className="error-text modal-field--full">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annulla
          </button>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : "Crea esercizio"}
          </PrimaryButton>
        </div>
      </form>
    </ModalBase>
  );
};

export default NewEsercizioModal;
