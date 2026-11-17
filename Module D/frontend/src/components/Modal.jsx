import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon = "info",
  tone = "primary",
  children,
  footer,
  size = "sm",
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        className={`modal${size === "wide" ? " modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <span
            className={`modal__icon${tone === "danger" ? " modal__icon--danger" : ""}`}
            aria-hidden="true"
          >
            <Icon name={icon} size={21} />
          </span>

          <div className="modal__heading">
            <h2 className="modal__title" id="modal-title">
              {title}
            </h2>
            {description ? <p className="modal__description">{description}</p> : null}
          </div>

          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        {children ? <div className="modal__body">{children}</div> : null}

        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
