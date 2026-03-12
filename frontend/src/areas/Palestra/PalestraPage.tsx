import { useEffect, useState, type FC } from "react";
import { getPalestraDati, type PalestraDati } from "../../api/palestra";
import "./PalestraPage.css";

const PALESTRA_ID = Number(import.meta.env.VITE_PALESTRA_ID ?? 1);

const PalestraPage: FC = () => {
  const [datiPalestra, setDatiPalestra] = useState<PalestraDati | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatiPalestra = async () => {
      try {
        setIsLoading(true);
        const data = await getPalestraDati(PALESTRA_ID);
        setDatiPalestra(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore imprevisto");
      } finally {
        setIsLoading(false);
      }
    };

    loadDatiPalestra();
  }, []);

  return (
    <section className="panel palestra-section reveal">
      {isLoading && <p className="muted">Caricamento dati palestra...</p>}
      {error && <p className="muted">{error}</p>}

      {!isLoading && !error && datiPalestra && (
        <>
          <header className="palestra-header">
            <h1 className="palestra-title">{datiPalestra.palestra.nome}</h1>
            <p className="muted palestra-address">
              {datiPalestra.palestra.indirizzo}, {datiPalestra.palestra.citta}
            </p>
            <p className="muted">P.IVA: {datiPalestra.palestra.partitaIva}</p>
          </header>

          <div className="palestra-table-wrapper" aria-label="Tabella attrezzi">
            <table className="palestra-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Anno</th>
                  <th scope="col">Quantita</th>
                </tr>
              </thead>
              <tbody>
                {datiPalestra.attrezzi.length === 0 && (
                  <tr>
                    <td colSpan={4} className="muted">
                      Nessun attrezzo trovato.
                    </td>
                  </tr>
                )}

                {datiPalestra.attrezzi.map((attrezzo) => (
                  <tr key={attrezzo.id}>
                    <td>{attrezzo.id}</td>
                    <td>{attrezzo.nome}</td>
                    <td>{attrezzo.anno}</td>
                    <td>{attrezzo.quantita}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default PalestraPage;
