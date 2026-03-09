import { useState, type FC, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUtente } from "../../api/utenti";
import "./Auth.css";

const RegisterPage: FC = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [sesso, setSesso] = useState<"" | "M" | "F" | "Altro">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);

    try {
      setIsSubmitting(true);

      await createUtente({
        nome: nome.trim(),
        cognome: cognome.trim(),
        email: email.trim(),
        password,
        telefono: telefono.trim() || undefined,
        data_nascita: dataNascita || undefined,
        sesso: sesso || undefined,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Errore durante la creazione dell'account",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page reveal">
      <article className="auth-card">
        <h1 className="auth-title">Crea account</h1>
        <p className="auth-subtitle muted">Registra un nuovo account locale.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Nome
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Cognome
            <input
              type="text"
              value={cognome}
              onChange={(event) => setCognome(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Telefono
            <input
              type="text"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Data di nascita
            <input
              type="date"
              value={dataNascita}
              onChange={(event) => setDataNascita(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            Sesso
            <select
              value={sesso}
              onChange={(event) =>
                setSesso(event.target.value as "" | "M" | "F" | "Altro")
              }
              disabled={isSubmitting}
            >
              <option value="">Seleziona</option>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Altro">Altro</option>
            </select>
          </label>

          {submitError && <p className="error-text">{submitError}</p>}

          <div className="auth-actions">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creazione account..." : "Crea account"}
            </button>
          </div>
        </form>

        <p className="auth-link-row muted">
          Hai già un account?{" "}
          <Link to="/login" className="auth-link">
            Vai al login
          </Link>
        </p>
      </article>
    </section>
  );
};

export default RegisterPage;
