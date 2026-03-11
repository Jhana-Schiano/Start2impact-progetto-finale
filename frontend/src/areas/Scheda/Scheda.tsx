import type { FC } from "react";
import { useParams } from "react-router-dom";

const Scheda: FC = () => {
  const { schedaId } = useParams<{ schedaId: string }>();

  return (
    <section className="panel reveal">
      <h1 className="section-title">Scheda {schedaId}</h1>
      <p className="muted">Dettaglio scheda in costruzione.</p>
    </section>
  );
};

export default Scheda;
