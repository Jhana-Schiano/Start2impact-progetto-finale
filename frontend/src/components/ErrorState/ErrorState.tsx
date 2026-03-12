import type { FC } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import "./ErrorState.css";

type ErrorStateProps = {
  message: string;
  className?: string;
};

const ErrorState: FC<ErrorStateProps> = ({ message, className }) => {
  const rootClassName = className ? `error-state ${className}` : "error-state";

  return (
    <div className={rootClassName} role="alert" aria-live="polite">
      <HiExclamationTriangle className="error-state-icon" aria-hidden="true" />
      <p className="error-state-message">{message}</p>
    </div>
  );
};

export default ErrorState;
