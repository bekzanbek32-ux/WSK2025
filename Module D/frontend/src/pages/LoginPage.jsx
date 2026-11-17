import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage, getFieldErrors, isUnauthorized } from "../api/client";
import AuthShell from "../components/AuthShell";
import Field from "../components/Field";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { validateLogin } from "../utils/validation";
import "./AuthPages.css";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ login: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle("Вход в аккаунт");

  const from = location.state?.from;
  const redirectTo = from?.pathname
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : "/";

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setServerError("");
    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  const validate = () => {
    const next = {};
    const loginError = validateLogin(form.login);

    if (loginError) next.login = loginError;
    if (!form.password) next.password = "Введите пароль";

    setErrors(next);

    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => {
        document.getElementById(Object.keys(next)[0])?.focus();
      });
    }

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      const profile = await login({
        login: form.login.trim(),
        password: form.password,
      });

      toast.success(
        `С возвращением${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}!`,
        "Вы вошли в аккаунт Geek Market.",
      );

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);

      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
      } else if (isUnauthorized(requestError)) {
        setServerError("Неверный e-mail, телефон или пароль. Проверьте данные и попробуйте снова.");
      } else {
        setServerError(getApiErrorMessage(requestError, "Не удалось войти. Попробуйте ещё раз."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setForm({ login: "liam@example.com", password: "liam_123" });
    setErrors({});
    setServerError("");
  };

  return (
    <AuthShell
      eyebrow="Вход"
      title="С возвращением"
      subtitle="Войдите, чтобы управлять объявлениями и продвигать их."
      footer={
        <p>
          Нет аккаунта?{" "}
          <Link to="/register" state={{ from }} className="link">
            Зарегистрироваться
            <Icon name="arrow-right" size={15} />
          </Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {serverError ? (
          <div className="form-error" role="alert">
            <Icon name="alert-circle" size={17} />
            <span>{serverError}</span>
          </div>
        ) : null}

        <Field label="E-mail или телефон" htmlFor="login" required error={errors.login}>
          <span className="input-group">
            <span className="input-group__icon" aria-hidden="true">
              <Icon name="user" size={17} />
            </span>
            <input
              id="login"
              type="text"
              className={`input${errors.login ? " input--invalid" : ""}`}
              placeholder="liam@example.com или +33 6 12 34 56 78"
              autoComplete="username"
              value={form.login}
              onChange={(event) => update("login", event.target.value)}
            />
          </span>
        </Field>

        <Field label="Пароль" htmlFor="password" required error={errors.password}>
          <span className="input-group auth-password">
            <span className="input-group__icon" aria-hidden="true">
              <Icon name="shield" size={17} />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`input${errors.password ? " input--invalid" : ""}`}
              placeholder="Ваш пароль"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
            />
            <button
              type="button"
              className="input-group__action"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
            </button>
          </span>
        </Field>

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
          {submitting ? <span className="spinner" /> : <Icon name="arrow-right" size={17} />}
          {submitting ? "Входим..." : "Войти"}
        </button>

        <div className="auth-demo">
          <div className="auth-demo__text">
            <span className="auth-demo__label">
              <Icon name="sparkles" size={14} />
              Демо-аккаунт
            </span>
            <span>
              <code>liam@example.com</code> · <code>liam_123</code>
            </span>
          </div>
          <button type="button" className="btn btn--sm btn--outline" onClick={fillDemo}>
            Подставить
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
