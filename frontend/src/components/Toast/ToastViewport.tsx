import { useEffect, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  dismissToast,
  selectToasts,
  type ToastItem,
} from "../../store/toastSlice";
import "./Toast.css";

type ToastRowProps = {
  toast: ToastItem;
};

// Singolo elemento toast con auto-chiusura e chiusura manuale.
const ToastRow: FC<ToastRowProps> = ({ toast }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (toast.durationMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch(dismissToast(toast.id));
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, toast.durationMs, toast.id]);

  return (
    <div
      className={`toast toast-${toast.kind}`}
      role="status"
      data-duration-ms={toast.durationMs}
    >
      <p className="toast-message">{toast.message}</p>
      <button
        type="button"
        className="toast-close"
        aria-label="Chiudi notifica"
        onClick={() => dispatch(dismissToast(toast.id))}
      >
        ×
      </button>
    </div>
  );
};

// Contenitore globale che visualizza la coda dei toast nello stato Redux.
const ToastViewport: FC = () => {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastViewport;
