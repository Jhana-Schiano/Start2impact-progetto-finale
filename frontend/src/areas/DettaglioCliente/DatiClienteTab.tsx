import type { FC } from "react";
import { useOutletContext } from "react-router-dom";
import type { DettaglioClienteContext } from "./DettaglioClientePage";

const formatValue = (value: string | number | null | undefined): string => {
  if (value == null || value === "") {
    return "-";
  }

  return String(value);
};

const DatiClienteTab: FC = () => {
  const { cliente, isLoadingCliente, errorCliente } =
    useOutletContext<DettaglioClienteContext>();

  if (isLoadingCliente) {
    return <p className="muted">Caricamento dati cliente...</p>;
  }

  if (errorCliente || !cliente) {
    return <p className="error-text">Impossibile mostrare i dati cliente.</p>;
  }

  return (
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
          <dd>
            {formatValue(cliente.indirizzo)}, {formatValue(cliente.citta)}
          </dd>
        </div>
      </div>

      <div className="detail-row-group">
        <p className="detail-row-title">DATI CLINICI</p>
        <div className="detail-row">
          <dt>Altezza</dt>
          <dd>{formatValue(cliente.altezza)} cm</dd>
        </div>
        <div className="detail-row">
          <dt>Peso</dt>
          <dd>{formatValue(cliente.peso)} kg</dd>
        </div>
        <div className="detail-row">
          <dt>Massa magra</dt>
          <dd>{formatValue(cliente.massaMagra)} kg</dd>
        </div>
        <div className="detail-row">
          <dt>Massa grassa</dt>
          <dd>{formatValue(cliente.massaGrassa)} kg</dd>
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
  );
};

export default DatiClienteTab;
