import Icon from "../components/Icon";

const TONES = {
  success: { icon: "check-circle", title: "Готово", role: "status" },
  error: { icon: "alert-circle", title: "Ошибка", role: "alert" },
  info: { icon: "info", title: "Обратите внимание", role: "status" },
};

export default function Toast({ toast, onClose }) {
  const tone = TONES[toast.type] || TONES.info;
  const title = toast.title || tone.title;

  return (
    <div
      className={`toast toast--${toast.type || "info"}`}
      role={tone.role}
      aria-live={tone.role === "alert" ? "assertive" : "polite"}
    >
      <span className="toast__icon" aria-hidden="true">
        <Icon name={tone.icon} size={17} />
      </span>

      <div className="toast__content">
        <div className="toast__title">{title}</div>
        {toast.message ? <div className="toast__message">{toast.message}</div> : null}
      </div>

      <button
        type="button"
        className="toast__close"
        onClick={() => onClose(toast.id)}
        aria-label="Закрыть уведомление"
      >
        <Icon name="close" size={14} />
      </button>

      <span className="toast__progress" aria-hidden="true" />
    </div>
  );
}
