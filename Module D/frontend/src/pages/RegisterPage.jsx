import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage, getFieldErrors } from "../api/client";
import AuthShell from "../components/AuthShell";
import Field from "../components/Field";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  normalizePhone,
  runValidators,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../utils/validation";
import "./AuthPages.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

const STRENGTH_LABELS = ["Слишком короткий", "Слабый", "Средний", "Хороший", "Надёжный"];

function measureStrength(password) {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score += 1;

  return Math.min(5, score);
}

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle("Регистрация");

  const from = location.state?.from;
  const redirectTo = from?.pathname
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : "/";

  const strength = useMemo(() => measureStrength(form.password), [form.password]);

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
    const next = runValidators(form, {
      name: validateName,
      email: validateEmail,
      phone: validatePhone,
      password: validatePassword,
    });

    if (!form.confirm) next.confirm = "Повторите пароль";
    else if (form.confirm !== form.password) next.confirm = "Пароли не совпадают";

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
      const profile = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: normalizePhone(form.phone),
        password: form.password,
      });

      toast.success(
        `Добро пожаловать${profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}!`,
        "Аккаунт создан — вы уже вошли в Geek Market.",
      );

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);

      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
      }

      setServerError(
        Object.keys(fieldErrors).length
          ? "Проверьте отмеченные поля и попробуйте снова."
          : getApiErrorMessage(requestError, "Не удалось создать аккаунт. Попробуйте ещё раз."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Регистрация"
      title="Создайте аккаунт"
      subtitle="Публикация объявлений бесплатна. Понадобится только имя и контакты."
      footer={
        <p>
          Уже есть аккаунт?{" "}
          <Link to="/login" state={{ from }} className="link">
            Войти
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

        <Field label="Имя и фамилия" htmlFor="name" required error={errors.name}>
          <input
            id="name"
            type="text"
            className={`input${errors.name ? " input--invalid" : ""}`}
            placeholder="Оливия Браун"
            autoComplete="name"
            value={form.name}
            maxLength={100}
            onChange={(event) => update("name", event.target.value)}
          />
        </Field>

        <div className="form-grid">
          <Field label="E-mail" htmlFor="email" required error={errors.email}>
            <input
              id="email"
              type="email"
              className={`input${errors.email ? " input--invalid" : ""}`}
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>

          <Field label="Телефон" htmlFor="phone" required error={errors.phone}>
            <input
              id="phone"
              type="tel"
              className={`input${errors.phone ? " input--invalid" : ""}`}
              placeholder="+7 700 123 45 67"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Пароль"
          htmlFor="password"
          required
          error={errors.password}
          hint="Минимум 8 символов, лучше — буквы и цифры"
        >
          <span className="input-group auth-password">
            <span className="input-group__icon" aria-hidden="true">
              <Icon name="shield" size={17} />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`input${errors.password ? " input--invalid" : ""}`}
              placeholder="Придумайте пароль"
              autoComplete="new-password"
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

        {form.password ? (
          <div className="password-meter" aria-live="polite">
            <div className="password-meter__bars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((step) => (
                <span
                  key={step}
                  className={step <= strength ? "is-filled" : ""}
                  data-level={strength}
                />
              ))}
            </div>
            <span className="password-meter__label">
              Надёжность пароля: <strong>{STRENGTH_LABELS[strength]}</strong>
            </span>
          </div>
        ) : null}

        <Field label="Повторите пароль" htmlFor="confirm" required error={errors.confirm}>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            className={`input${errors.confirm ? " input--invalid" : ""}`}
            placeholder="Ещё раз"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(event) => update("confirm", event.target.value)}
          />
        </Field>

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
          {submitting ? <span className="spinner" /> : <Icon name="check" size={17} />}
          {submitting ? "Создаём аккаунт..." : "Создать аккаунт"}
        </button>

        <p className="auth-legal">
          Создавая аккаунт, вы соглашаетесь с правилами площадки и обработкой
          персональных данных.
        </p>
      </form>
    </AuthShell>
  );
}
