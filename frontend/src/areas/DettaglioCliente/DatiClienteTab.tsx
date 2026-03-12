import { useState, type FC } from "react";
import { useOutletContext } from "react-router-dom";
import { updateCliente, type UpdateClienteInput } from "../../api/clienti";
import { ErrorState, PrimaryButton } from "../../components/Index";
import type { DettaglioClienteContext } from "./DettaglioClientePage";
import EditClienteModal from "./EditClienteModal";

const formatValue = (value: string | number | null | undefined): string => {
  if (value == null || value === "") {
    return "-";
  }

  return String(value);
};

const formatAddress = (
  address: string | null | undefined,
  city: string | null | undefined,
): string => {
  const parts = [address, city].filter(
    (part): part is string => part != null && part !== "",
  );

  return parts.length > 0 ? parts.join(", ") : "-";
};

const DatiClienteTab: FC = () => {
  const { cliente, clienteId, isLoadingCliente, errorCliente, reloadCliente } =
    useOutletContext<DettaglioClienteContext>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (isLoadingCliente) {
    return <p className="muted">Caricamento dati cliente...</p>;
  }

  if (errorCliente || !cliente) {
    return <ErrorState message="Impossibile mostrare i dati cliente." />;
  }

  const handleSave = async (payload: UpdateClienteInput) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      await updateCliente(clienteId, payload);
      await reloadCliente();
      setIsEditModalOpen(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {saveError && (
        <ErrorState message={saveError} className="detail-save-error" />
      )}

      <dl className="detail-grid">
        <div className="detail-row-group">
          <p className="detail-row-title">CONTATTI</p>
          <div className="detail-row">
            <dt>Telefono</dt>
            <dd>{formatValue(cliente.telefono)}</dd>
          </div>
          <div className="detail-row">
            <dt>Email</dt>
            <dd>{formatValue(cliente.email)}</dd>
          </div>
          <div className="detail-row">
            <dt>Indirizzo</dt>
            <dd>{formatAddress(cliente.indirizzo, cliente.citta)}</dd>
          </div>
        </div>

        <div className="detail-row-group">
          <p className="detail-row-title">DATI CLINICI</p>
          <div className="detail-row">
            <dt>Altezza</dt>
            <dd>{cliente.altezza} cm</dd>
          </div>
          <div className="detail-row">
            <dt>Peso</dt>
            <dd>{cliente.peso} kg</dd>
          </div>
          <div className="detail-row">
            <dt>Massa magra</dt>
            <dd>{cliente.massaMagra} kg</dd>
          </div>
          <div className="detail-row">
            <dt>Massa grassa</dt>
            <dd>{cliente.massaGrassa} kg</dd>
          </div>
        </div>

        <div className="detail-row-group">
          <p className="detail-row-title">CONDIZIONI</p>
          <div className="detail-row">
            <dt>Condizioni mediche</dt>
            <dd>{formatValue(cliente.condizioniMediche)}</dd>
          </div>
          <div className="detail-row">
            <dt>Terapie</dt>
            <dd>{formatValue(cliente.terapie)}</dd>
          </div>
        </div>

        <div className="detail-row-group">
          <p className="detail-row-title">APPUNTI</p>
          <div className="detail-row">
            <dt>Note</dt>
            <dd>{formatValue(cliente.note)}</dd>
          </div>
          <div className="detail-row">
            <dt>Lavoro</dt>
            <dd>{formatValue(cliente.lavoro)}</dd>
          </div>
        </div>
      </dl>

      <div className="detail-actions">
        <PrimaryButton
          type="button"
          onClick={() => {
            setSaveError(null);
            setIsEditModalOpen(true);
          }}
        >
          Modifica dati
        </PrimaryButton>
      </div>

      {isEditModalOpen && (
        <EditClienteModal
          isOpen={isEditModalOpen}
          isSubmitting={isSaving}
          submitError={saveError}
          cliente={cliente}
          onClose={() => {
            if (!isSaving) {
              setSaveError(null);
              setIsEditModalOpen(false);
            }
          }}
          onSubmit={handleSave}
        />
      )}
    </>
  );
};

export default DatiClienteTab;
