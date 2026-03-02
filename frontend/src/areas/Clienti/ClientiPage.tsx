import { useEffect, useState, type FC } from "react";
import { getAllClienti, type Cliente } from "../../api/clienti";
import "./Clienti.css";

const ClientiPage: FC = () => {
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClienti = async () => {
      try {
        const response = await getAllClienti();
        setClienti(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore imprevisto");
      } finally {
        setIsLoading(false);
      }
    };

    loadClienti();
  }, []);

  return (
    <section className="panel stack clienti-section reveal">
      <header>
        <h1 className="section-title">Clienti</h1>
      </header>

      {isLoading && <p className="muted">Caricamento clienti...</p>}
      {error && <p className="muted">{error}</p>}

      <div
        className="clienti-table-wrapper"
        role="region"
        aria-label="Tabella clienti"
      >
        <table className="clienti-table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Cognome</th>
              <th scope="col">Data nascita</th>
              <th scope="col">Sesso</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && !error && clienti.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  Nessun cliente trovato.
                </td>
              </tr>
            )}

            {clienti.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cognome}</td>
                <td>
                  {new Date(cliente.dataNascita).toLocaleDateString("it-IT")}
                </td>
                <td>{cliente.sesso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ClientiPage;
