import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  changeAdvertStatus,
  createAdvert,
  fetchAdvert,
  getCachedAdvert,
  updateAdvert,
} from "../api/adverts";
import { fetchCategories } from "../api/categories";
import { getApiErrorMessage, getFieldErrors } from "../api/client";
import AdvertCard from "../components/AdvertCard";
import Field from "../components/Field";
import Icon from "../components/Icon";
import PhotoManager from "../components/PhotoManager";
import StatusBadge from "../components/StatusBadge";
import { ErrorState, PageLoader } from "../components/States";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { isAdvertOwner } from "../utils/adverts";
import "./EditorPage.css";

const EMPTY_FORM = {
  title: "",
  text: "",
  price: "",
  category_id: "",
  photos: [],
};

const TITLE_MAX = 200;
const TEXT_MAX = 1000;

function buildForm(advert) {
  return {
    title: advert?.title || "",
    text: advert?.text || "",
    price: advert?.price === null || advert?.price === undefined ? "" : String(advert.price),
    category_id: advert?.category_id ? String(advert.category_id) : "",
    photos: advert?.photos || [],
  };
}

export default function EditorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const cached = isEdit ? getCachedAdvert(id) : null;

  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState(false);
  const [categoriesToken, setCategoriesToken] = useState(0);

  const [advert, setAdvert] = useState(cached);
  const [form, setForm] = useState(() => buildForm(cached));
  const [initial, setInitial] = useState(() => buildForm(cached));
  const [loading, setLoading] = useState(isEdit && !cached);
  const [loadError, setLoadError] = useState(null);
  const [loadToken, setLoadToken] = useState(0);
  const [accessError, setAccessError] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState("");

  useDocumentTitle(isEdit ? "Редактирование объявления" : "Новое объявление");

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((list) => {
        if (active) {
          setCategories(list);
          setCategoriesError(false);
        }
      })
      .catch(() => {
        if (active) setCategoriesError(true);
      });

    return () => {
      active = false;
    };
  }, [categoriesToken]);

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;

    if (!getCachedAdvert(id)) setLoading(true);
    setLoadError(null);
    setAccessError("");

    fetchAdvert(id)
      .then((data) => {
        if (!active) return;

        if (!data) {
          setLoadError(new Error("not-found"));
          return;
        }

        setAdvert(data);

        const nextForm = buildForm(data);

        setForm(nextForm);
        setInitial(nextForm);

        if (!isAdvertOwner(data, user)) {
          setAccessError("owner");
        } else if (data.status !== "draft") {
          setAccessError("status");
        }
      })
      .catch((requestError) => {
        if (active) setLoadError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEdit, user, loadToken]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

  useEffect(() => {
    if (!dirty || submitting) return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty, submitting]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  const validate = () => {
    const next = {};
    const title = form.title.trim();
    const text = form.text.trim();

    if (!title) next.title = "Введите название объявления";
    else if (title.length < 5) next.title = "Название должно быть не короче 5 символов";
    else if (title.length > TITLE_MAX) next.title = `Максимум ${TITLE_MAX} символов`;

    if (!text) next.text = "Добавьте описание";
    else if (text.length < 10) next.text = "Опишите товар подробнее — минимум 10 символов";
    else if (text.length > TEXT_MAX) next.text = `Максимум ${TEXT_MAX} символов`;

    if (form.price === "" || form.price === null) {
      next.price = "Укажите цену (0 — договорная)";
    } else if (!Number.isFinite(Number(form.price))) {
      next.price = "Цена должна быть числом";
    } else if (Number(form.price) < 0) {
      next.price = "Цена не может быть отрицательной";
    }

    if (!form.category_id) next.category_id = "Выберите категорию";

    if (!form.photos.length) next.photos = "Добавьте хотя бы одну фотографию";

    setErrors(next);

    if (Object.keys(next).length) {
      const firstField = Object.keys(next)[0];

      window.requestAnimationFrame(() => {
        const element = document.getElementById(firstField);

        element?.focus();
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    return Object.keys(next).length === 0;
  };

  const submit = async (intent) => {
    setServerError("");

    if (!validate()) {
      toast.error("Проверьте форму", "Некоторые поля заполнены неверно.");
      return;
    }

    setSubmitting(intent);

    const payload = {
      title: form.title.trim(),
      text: form.text.trim(),
      price: Number(form.price),
      category_id: form.category_id,
      photos: form.photos,
    };

    let saved;

    try {
      saved = isEdit ? await updateAdvert(id, payload) : await createAdvert(payload);
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);
      const message = getApiErrorMessage(requestError);

      if (Object.keys(fieldErrors).length) {
        setErrors((current) => ({ ...current, ...fieldErrors }));
      }

      setServerError(message);
      toast.error("Не удалось сохранить объявление", message);
      setSubmitting("");

      return;
    }

    if (intent === "moderation") {
      try {
        await changeAdvertStatus(saved?.id || id, "moderation");
      } catch (requestError) {
        toast.error(
          "Черновик сохранён",
          `Но отправить на модерацию не удалось: ${getApiErrorMessage(requestError)}`,
        );
        setSubmitting("");
        navigate("/my-adverts");

        return;
      }
    }

    setInitial(form);
    setSubmitting("");

    toast.success(
      intent === "moderation"
        ? "Объявление отправлено на модерацию"
        : isEdit
          ? "Изменения сохранены"
          : "Черновик создан",
      intent === "moderation"
        ? "Мы проверим объявление и опубликуем его в каталоге."
        : "Черновик виден только вам. Его можно отправить на модерацию в любой момент.",
    );

    navigate("/my-adverts", { replace: true });
  };

  const preview = useMemo(
    () => ({
      id: "preview",
      title: form.title.trim() || "Название объявления",
      text: form.text.trim() || "Описание появится здесь, как только вы его добавите.",
      price: Number(form.price) || 0,
      category:
        categories.find((category) => String(category.id) === String(form.category_id)) || {
          name: "Категория",
        },
      category_id: form.category_id,
      photos: form.photos,
      created_at: new Date().toISOString(),
      paidServices: [],
    }),
    [form, categories],
  );

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <PageLoader label="Загружаем объявление..." />
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page">
        <div className="container">
          <ErrorState
            title="Не удалось открыть объявление"
            description="Возможно, оно было удалено. Вернитесь к списку своих объявлений."
            onRetry={() => setLoadToken((token) => token + 1)}
          />
          <div className="editor-error-actions">
            <Link to="/my-adverts" className="btn btn--primary">
              Мои объявления
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="page">
        <div className="container">
          <ErrorState
            title={
              accessError === "owner"
                ? "Это объявление вам не принадлежит"
                : "Редактирование сейчас недоступно"
            }
            description={
              accessError === "owner"
                ? "Редактировать объявление может только его автор."
                : "Редактировать можно только черновики. Объявление на модерации или опубликованное сначала нужно вернуть в черновик."
            }
          />
          <div className="editor-error-actions">
            <Link to={`/adverts/${id}`} className="btn btn--outline">
              Открыть объявление
            </Link>
            <Link to="/my-adverts" className="btn btn--primary">
              Мои объявления
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page editor-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Навигационная цепочка">
          <Link to="/my-adverts">Мои объявления</Link>
          <Icon name="chevron-right" size={13} />
          <span aria-current="page">
            {isEdit ? "Редактирование" : "Новое объявление"}
          </span>
        </nav>

        <header className="editor-head">
          <div>
            <span className="eyebrow">{isEdit ? "Черновик" : "Новое объявление"}</span>
            <h1>{isEdit ? advert?.title || "Редактирование" : "Разместите объявление"}</h1>
            <p>
              {isEdit
                ? "Изменения применяются к черновику. После отправки на модерацию редактирование станет недоступно."
                : "Заполните основные поля, добавьте фотографии — и сохраните черновик. Публикация бесплатна."}
            </p>
          </div>

          {isEdit && advert ? <StatusBadge status={advert.status} /> : null}
        </header>

        <form
          className="editor-layout"
          onSubmit={(event) => {
            event.preventDefault();
            submit("draft");
          }}
          noValidate
        >
          <div className="editor-main">
            {serverError ? (
              <div className="form-error" role="alert">
                <Icon name="alert-circle" size={17} />
                {serverError}
              </div>
            ) : null}

            <section className="editor-card">
              <div className="editor-card__head">
                <span className="editor-card__step">1</span>
                <div>
                  <h2>Основное</h2>
                  <p>Коротко и понятно опишите, что вы продаёте.</p>
                </div>
              </div>

              <div className="editor-card__body">
                <Field
                  label="Название объявления"
                  htmlFor="title"
                  required
                  error={errors.title}
                  counter={`${form.title.length}/${TITLE_MAX}`}
                >
                  <input
                    id="title"
                    type="text"
                    className={`input${errors.title ? " input--invalid" : ""}`}
                    placeholder="Например, iPhone 13 Pro 256 ГБ"
                    value={form.title}
                    maxLength={TITLE_MAX}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </Field>

                <div className="form-grid">
                  <Field label="Категория" htmlFor="category_id" required error={errors.category_id}>
                    <select
                      id="category_id"
                      className={`select${errors.category_id ? " select--invalid" : ""}`}
                      value={form.category_id}
                      onChange={(event) => updateField("category_id", event.target.value)}
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Цена, $"
                    htmlFor="price"
                    required
                    error={errors.price}
                    hint="Укажите 0, если цена договорная"
                  >
                    <input
                      id="price"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className={`input${errors.price ? " input--invalid" : ""}`}
                      placeholder="0"
                      value={form.price}
                      onChange={(event) => updateField("price", event.target.value)}
                    />
                  </Field>
                </div>

                {categoriesError ? (
                  <div className="alert alert--warning">
                    <Icon name="alert-circle" size={16} />
                    <div className="alert__body">
                      <span className="alert__title">Категории не загрузились</span>
                      <span className="alert__text">
                        Без категории сохранить объявление нельзя.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--sm btn--outline"
                      onClick={() => setCategoriesToken((token) => token + 1)}
                    >
                      Повторить
                    </button>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="editor-card">
              <div className="editor-card__head">
                <span className="editor-card__step">2</span>
                <div>
                  <h2>Описание</h2>
                  <p>Состояние, комплектация и условия сделки.</p>
                </div>
              </div>

              <div className="editor-card__body">
                <Field
                  label="Текст объявления"
                  htmlFor="text"
                  required
                  error={errors.text}
                  counter={`${form.text.length}/${TEXT_MAX}`}
                >
                  <textarea
                    id="text"
                    className={`textarea${errors.text ? " textarea--invalid" : ""}`}
                    placeholder="Расскажите о товаре: состояние, характеристики, причина продажи, возможность торга..."
                    value={form.text}
                    maxLength={TEXT_MAX}
                    rows={7}
                    onChange={(event) => updateField("text", event.target.value)}
                  />
                </Field>
              </div>
            </section>

            <section className="editor-card">
              <div className="editor-card__head">
                <span className="editor-card__step">3</span>
                <div>
                  <h2>Фотографии</h2>
                  <p>Первая фотография станет обложкой объявления.</p>
                </div>
              </div>

              <div className="editor-card__body">
                <PhotoManager
                  photos={form.photos}
                  onChange={(photos) => updateField("photos", photos)}
                  error={errors.photos}
                />
              </div>
            </section>

            <div className="editor-actions">
              <Link to="/my-adverts" className="btn btn--ghost">
                Отмена
              </Link>

              <div className="editor-actions__right">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => submit("moderation")}
                  disabled={Boolean(submitting)}
                >
                  {submitting === "moderation" ? (
                    <span className="spinner" />
                  ) : (
                    <Icon name="send" size={16} />
                  )}
                  Сохранить и отправить
                </button>

                <button type="submit" className="btn btn--primary" disabled={Boolean(submitting)}>
                  {submitting === "draft" ? (
                    <span className="spinner" />
                  ) : (
                    <Icon name="check" size={16} />
                  )}
                  {isEdit ? "Сохранить изменения" : "Сохранить черновик"}
                </button>
              </div>
            </div>
          </div>

          <aside className="editor-aside">
            <div className="editor-preview">
              <span className="editor-preview__label">Предпросмотр карточки</span>
              <div className="editor-preview__card" aria-hidden="true">
                <AdvertCard advert={preview} />
              </div>
            </div>

            <div className="editor-tips">
              <h2>
                <Icon name="sparkles" size={16} />
                Как получить больше откликов
              </h2>
              <ul>
                <li>Добавьте 3–5 качественных фотографий при хорошем свете.</li>
                <li>В названии укажите модель и ключевую характеристику.</li>
                <li>Честно опишите состояние и укажите причину продажи.</li>
                <li>После публикации подключите TOP или VIP для большего охвата.</li>
              </ul>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
