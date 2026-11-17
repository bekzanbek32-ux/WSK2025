import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { getApiErrorMessage, getFieldErrors, isUnauthorized } from "../api/client";
import Field from "../components/Field";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { formatDate, initials } from "../utils/format";
import {
  normalizePhone,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../utils/validation";
import "./ProfilePage.css";

const EMPTY_PASSWORDS = {
  current: "",
  next: "",
  repeat: "",
};

export default function ProfilePage() {
  const { user, saveProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useDocumentTitle("Профиль");

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user?.name, user?.email, user?.phone]);

  const profileDirty = useMemo(
    () =>
      profile.name.trim() !== (user?.name || "") ||
      profile.email.trim() !== (user?.email || "") ||
      normalizePhone(profile.phone) !== normalizePhone(user?.phone || ""),
    [profile, user],
  );

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileError("");
    setProfileErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  const updatePassword = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }));
    setPasswordError("");
    setPasswordErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError("");

    const next = {};

    const nameError = validateName(profile.name);

    if (nameError) next.name = nameError;

    const emailError = validateEmail(profile.email);

    if (emailError) next.email = emailError;

    const phoneError = validatePhone(profile.phone);

    if (phoneError) next.phone = phoneError;

    setProfileErrors(next);

    if (Object.keys(next).length) return;

    setSavingProfile(true);

    try {
      await saveProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: normalizePhone(profile.phone),
      });

      toast.success("Профиль обновлён", "Контактные данные сохранены.");
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);

      if (Object.keys(fieldErrors).length) {
        setProfileErrors(fieldErrors);
      }

      setProfileError(getApiErrorMessage(requestError));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");

    const next = {};

    if (!passwords.current) next.current = "Введите текущий пароль";
    if (!passwords.next) next.next = "Придумайте новый пароль";
    else {
      const passwordError = validatePassword(passwords.next);

      if (passwordError) next.next = passwordError;
      else if (passwords.next === passwords.current) {
        next.next = "Новый пароль должен отличаться от текущего";
      }
    }

    if (!passwords.repeat) next.repeat = "Повторите новый пароль";
    else if (passwords.repeat !== passwords.next) next.repeat = "Пароли не совпадают";

    setPasswordErrors(next);

    if (Object.keys(next).length) return;

    setSavingPassword(true);

    try {
      // The API has no dedicated password endpoint, so the current password is
      // verified through a login attempt before updating the profile.
      await loginUser({
        login: user?.email || normalizePhone(user?.phone || ""),
        password: passwords.current,
      });

      await saveProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: passwords.next,
        password_confirmation: passwords.repeat,
      });

      setPasswords(EMPTY_PASSWORDS);
      toast.success("Пароль обновлён", "Используйте новый пароль при следующем входе.");
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);

      if (isUnauthorized(requestError)) {
        setPasswordErrors({ current: "Текущий пароль неверен" });
      } else if (fieldErrors.password) {
        setPasswordErrors({ next: fieldErrors.password });
      } else {
        setPasswordError(getApiErrorMessage(requestError));
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    // Leave the protected route first: clearing the session re-renders the
    // route guard, which would otherwise redirect to /login before we navigate.
    navigate("/", { replace: true });
    await logout();
    toast.success("Вы вышли из аккаунта");
  };

  return (
    <main className="page profile-page">
      <div className="container">
        <header className="profile-head">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1>Профиль</h1>
            <p>Управляйте личными данными и безопасностью аккаунта.</p>
          </div>

          <Link to="/my-adverts" className="btn btn--outline">
            <Icon name="layers" size={16} />
            Мои объявления
          </Link>
        </header>

        <div className="profile-grid">
          <aside className="profile-summary">
            <div className="profile-summary__top">
              <span className="profile-avatar" aria-hidden="true">
                {initials(user?.name || user?.email)}
              </span>
              <h2>{user?.name || "Пользователь"}</h2>
              <span className="badge badge--violet">
                {user?.role === "moderator" ? "Модератор" : "Продавец"}
              </span>
            </div>

            <dl className="profile-summary__contacts">
              <div>
                <dt>
                  <Icon name="send" size={15} />
                  E-mail
                </dt>
                <dd>{user?.email || "Не указан"}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="phone" size={15} />
                  Телефон
                </dt>
                <dd>{user?.phone || "Не указан"}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="calendar" size={15} />
                  На сайте с
                </dt>
                <dd>
                  {user?.created_at
                    ? formatDate(user.created_at, { short: true })
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>
                  <Icon name="user" size={15} />
                  ID аккаунта
                </dt>
                <dd>#{user?.id || "—"}</dd>
              </div>
            </dl>

            <div className="profile-summary__actions">
              <Link to="/adverts/new" className="btn btn--primary btn--block">
                <Icon name="plus" size={16} />
                Разместить объявление
              </Link>
              <button type="button" className="btn btn--outline btn--block" onClick={handleLogout}>
                <Icon name="logout" size={16} />
                Выйти из аккаунта
              </button>
            </div>

            <p className="profile-summary__note">
              <Icon name="shield-check" size={14} />
              Данные видны только вам и используются для связи с покупателями.
            </p>
          </aside>

          <div className="profile-forms">
            <form className="profile-card" onSubmit={handleProfileSubmit} noValidate>
              <div className="profile-card__head">
                <span className="profile-card__icon">
                  <Icon name="user" size={19} />
                </span>
                <div>
                  <h2>Личные данные</h2>
                  <p>Имя и контакты, по которым с вами связываются покупатели.</p>
                </div>
              </div>

              {profileError ? (
                <div className="form-error" role="alert">
                  <Icon name="alert-circle" size={17} />
                  <span>{profileError}</span>
                </div>
              ) : null}

              <div className="profile-card__body">
                <Field label="Имя и фамилия" htmlFor="profile-name" required error={profileErrors.name}>
                  <input
                    id="profile-name"
                    type="text"
                    className={`input${profileErrors.name ? " input--invalid" : ""}`}
                    value={profile.name}
                    autoComplete="name"
                    maxLength={100}
                    onChange={(event) => updateProfile("name", event.target.value)}
                  />
                </Field>

                <div className="form-grid">
                  <Field label="E-mail" htmlFor="profile-email" required error={profileErrors.email}>
                    <input
                      id="profile-email"
                      type="email"
                      className={`input${profileErrors.email ? " input--invalid" : ""}`}
                      value={profile.email}
                      autoComplete="email"
                      onChange={(event) => updateProfile("email", event.target.value)}
                    />
                  </Field>

                  <Field label="Телефон" htmlFor="profile-phone" required error={profileErrors.phone}>
                    <input
                      id="profile-phone"
                      type="tel"
                      className={`input${profileErrors.phone ? " input--invalid" : ""}`}
                      value={profile.phone}
                      autoComplete="tel"
                      onChange={(event) => updateProfile("phone", event.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="profile-card__footer">
                <span className="profile-card__hint">
                  {profileDirty
                    ? "Есть несохранённые изменения"
                    : "Все изменения сохранены"}
                </span>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={savingProfile || !profileDirty}
                >
                  {savingProfile ? <span className="spinner" /> : <Icon name="check" size={16} />}
                  Сохранить изменения
                </button>
              </div>
            </form>

            <form className="profile-card" onSubmit={handlePasswordSubmit} noValidate>
              <div className="profile-card__head">
                <span className="profile-card__icon profile-card__icon--amber">
                  <Icon name="shield" size={19} />
                </span>
                <div>
                  <h2>Безопасность</h2>
                  <p>Смените пароль: понадобится текущий и новый пароль.</p>
                </div>
                <button
                  type="button"
                  className="profile-card__toggle"
                  onClick={() => setShowPasswords((shown) => !shown)}
                >
                  <Icon name={showPasswords ? "eye-off" : "eye"} size={15} />
                  {showPasswords ? "Скрыть" : "Показать"}
                </button>
              </div>

              {passwordError ? (
                <div className="form-error" role="alert">
                  <Icon name="alert-circle" size={17} />
                  <span>{passwordError}</span>
                </div>
              ) : null}

              <div className="profile-card__body">
                <Field
                  label="Текущий пароль"
                  htmlFor="current-password"
                  required
                  error={passwordErrors.current}
                >
                  <input
                    id="current-password"
                    type={showPasswords ? "text" : "password"}
                    className={`input${passwordErrors.current ? " input--invalid" : ""}`}
                    value={passwords.current}
                    autoComplete="current-password"
                    onChange={(event) => updatePassword("current", event.target.value)}
                  />
                </Field>

                <div className="form-grid">
                  <Field
                    label="Новый пароль"
                    htmlFor="new-password"
                    required
                    error={passwordErrors.next}
                    hint="Минимум 8 символов"
                  >
                    <input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      className={`input${passwordErrors.next ? " input--invalid" : ""}`}
                      value={passwords.next}
                      autoComplete="new-password"
                      onChange={(event) => updatePassword("next", event.target.value)}
                    />
                  </Field>

                  <Field
                    label="Повторите пароль"
                    htmlFor="repeat-password"
                    required
                    error={passwordErrors.repeat}
                  >
                    <input
                      id="repeat-password"
                      type={showPasswords ? "text" : "password"}
                      className={`input${passwordErrors.repeat ? " input--invalid" : ""}`}
                      value={passwords.repeat}
                      autoComplete="new-password"
                      onChange={(event) => updatePassword("repeat", event.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="profile-card__footer">
                <span className="profile-card__hint">
                  После смены пароля текущая сессия останется активной.
                </span>
                <button type="submit" className="btn btn--dark" disabled={savingPassword}>
                  {savingPassword ? <span className="spinner" /> : <Icon name="shield-check" size={16} />}
                  Сменить пароль
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
