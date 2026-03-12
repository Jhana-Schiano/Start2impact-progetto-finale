import { useEffect, type FC, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

type ModalBaseProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  ariaLabelledBy?: string;
}>;

const ModalBase: FC<ModalBaseProps> = ({
  isOpen,
  onClose,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  ariaLabelledBy,
  children,
}) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ModalBase;
