import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 5000;
const MAX_TOASTS = 4;

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((type, title, message) => {
    const id = (nextId += 1);

    setToasts((current) =>
      [...current, { id, type, title, message }].slice(-MAX_TOASTS),
    );

    return id;
  }, []);

  useEffect(() => {
    if (!toasts.length) return undefined;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => remove(toast.id), AUTO_DISMISS_MS),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, remove]);

  const api = useMemo(
    () => ({
      success: (title, message) => push("success", title, message),
      error: (title, message) => push("error", title, message),
      info: (title, message) => push("info", title, message),
      dismiss: remove,
    }),
    [push, remove],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="toast-stack">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={remove} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return context;
}
