import { useState, type FC, type SyntheticEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";
import {
  loginUser,
  selectAuthState,
  selectIsAuthenticated,
} from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type LocationState = {
  from?: string;
};

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector(selectAuthState);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const locationState = location.state as LocationState | null;
  const redirectTo =
    locationState?.from && locationState.from !== "/login"
      ? locationState.from
      : "/profilo";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setFormError("Email e password sono obbligatorie");
      return;
    }

    setFormError(null);

    const actionResult = await dispatch(
      loginUser({
        email: trimmedEmail,
        password,
      }),
    );

    if (loginUser.fulfilled.match(actionResult)) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <section className="auth-page reveal">
      <article className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle muted">Accedi al tuo account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
            />
          </label>

          {(formError || error) && (
            <p className="error-text">{formError ?? error}</p>
          )}

          <div className="auth-actions">
            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </button>
          </div>
        </form>

        <p className="auth-link-row muted">
          Non hai un account?{" "}
          <Link to="/register" className="auth-link">
            Registrati
          </Link>
        </p>
      </article>
    </section>
  );
};

export default LoginPage;
