import Icon from "./Icon";
import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  tone = "primary",
  icon = "info",
  loading = false,
  children,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      description={description}
      icon={icon}
      tone={tone}
      footer={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${tone === "danger" ? "btn--danger" : "btn--primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <Icon name="check" size={16} />}
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
