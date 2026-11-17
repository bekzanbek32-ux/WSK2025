import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  changeAdvertStatus,
  deleteAdvert,
  fetchMyAdverts,
} from "../api/adverts";
import { getApiErrorMessage } from "../api/client";
import AdvertMedia from "../components/AdvertMedia";
import ConfirmDialog from "../components/ConfirmDialog";
import Icon from "../components/Icon";
import { EmptyState, ErrorState } from "../components/States";
import StatusBadge, { ServiceBadge } from "../components/StatusBadge";
import { ADVERT_STATUSES, STATUS_TABS } from "../constants";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getActiveServices } from "../utils/adverts";
import { formatDate, formatPrice, plural, stripHtml } from "../utils/format";
import "./MyAdvertsPage.css";

const ACTIONS = {
  moderation: {
    title: "Отправить на модерацию?",
    description:
      "Объявление проверит модератор. После одобрения оно появится в каталоге и станет доступно покупателям.",
    confirmLabel: "Отправить",
    icon: "send",
    tone: "primary",
  },
  archive: {
    title: "Архивировать объявление?",
    description:
      "Объявление скроется из каталога. Из архива его можно будет удалить без возможности восстановления.",
    confirmLabel: "В архив",
    icon: "archive",
    tone: "primary",
  },
  draft: {
    title: "Вернуть в черновик?",
    description:
      "Объявление снова станет черновиком: вы сможете отредактировать его и повторно отправить на модерацию.",
    confirmLabel: "В черновик",
    icon: "edit",
    tone: "primary",
  },
  delete: {
    title: "Удалить объявление?",
    description:
      "Действие необратимо: объявление и его фотографии будут удалены навсегда.",
    confirmLabel: "Удалить",
    icon: "trash",
    tone: "danger",
  },
};

function MyAdvertRow({ advert, onAction, busy }) {
  const services = getActiveServices(advert.paidServices);
  const status = advert.status;
  const hint = ADVERT_STATUSES[status]?.hint;

  return (
    <li className="my-advert">
      <Link to={`/adverts/${advert.id}`} className="my-advert__media" tabIndex={-1} aria-hidden="true">
        <AdvertMedia
          src={advert.photos?.[0]}
          alt={advert.title}
          category={advert.category}
          className="my-advert__image"
        />
      </Link>

      <div className="my-advert__body">
        <div className="my-advert__top">
          <StatusBadge status={status} />
          {services.map((service) => (
            <ServiceBadge key={service.name} name={service.name} />
          ))}
          <time dateTime={advert.created_at || undefined}>
            {formatDate(advert.created_at, { short: true })}
          </time>
        </div>

        <h2 className="my-advert__title">
          <Link to={`/adverts/${advert.id}`}>{advert.title}</Link>
        </h2>

        <p className="my-advert__text">{stripHtml(advert.text) || "Без описания"}</p>

        <div className="my-advert__meta">
          <strong>{formatPrice(advert.price)}</strong>
          <span>{advert.category?.name || "Без категории"}</span>
          <span>ID {advert.id}</span>
          {Number(advert.views_count) > 0 ? (
            <span>
              <Icon name="eye" size={13} />
              {advert.views_count}
            </span>
          ) : null}
        </div>

        {status === "moderation" || status === "declined" ? (
          <p className="my-advert__hint">
            <Icon name="info" size={13} />
            {hint}
          </p>
        ) : null}
      </div>

      <div className="my-advert__actions">
        {status === "draft" ? (
          <>
            <Link to={`/adverts/${advert.id}/edit`} className="btn btn--sm btn--outline">
              <Icon name="edit" size={14} />
              Изменить
            </Link>
            <button
              type="button"
              className="btn btn--sm btn--primary"
              onClick={() => onAction(advert, "moderation")}
              disabled={busy}
            >
              <Icon name="send" size={14} />
              На модерацию
            </button>
          </>
        ) : null}

        {status === "published" ? (
          <>
            <Link to={`/adverts/${advert.id}`} className="btn btn--sm btn--outline">
              <Icon name="eye" size={14} />
              Открыть
            </Link>
            <Link
              to={`/adverts/${advert.id}/services`}
              className="btn btn--sm btn--outline"
            >
              <Icon name="rocket" size={14} />
              Продвинуть
            </Link>
          </>
        ) : null}

        {status === "declined" ? (
          <button
            type="button"
            className="btn btn--sm btn--outline"
            onClick={() => onAction(advert, "draft")}
            disabled={busy}
          >
            <Icon name="edit" size={14} />
            Вернуть в черновик
          </button>
        ) : null}

        {status === "archived" ? (
          <Link to={`/adverts/${advert.id}`} className="btn btn--sm btn--outline">
            <Icon name="eye" size={14} />
            Открыть
          </Link>
        ) : null}

        {status === "draft" || status === "declined" ? (
          <Link
            to={`/adverts/${advert.id}/services`}
            className="btn btn--sm btn--ghost"
          >
            <Icon name="crown" size={14} />
            Услуги
          </Link>
        ) : null}

        {status === "draft" || status === "archived" ? (
          <button
            type="button"
            className="btn btn--sm btn--danger"
            onClick={() => onAction(advert, "delete")}
            disabled={busy}
          >
            <Icon name="trash" size={14} />
            Удалить
          </button>
        ) : null}

        {status === "published" || status === "declined" ? (
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => onAction(advert, "archive")}
            disabled={busy}
          >
            <Icon name="archive" size={14} />
            В архив
          </button>
        ) : null}

        {status === "published" ? (
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => onAction(advert, "draft")}
            disabled={busy}
          >
            <Icon name="edit" size={14} />
            В черновик
          </button>
        ) : null}
      </div>
    </li>
  );
}

export default function MyAdvertsPage() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = STATUS_TABS.some((tab) => tab.value === searchParams.get("status"))
    ? searchParams.get("status")
    : "all";

  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [pending, setPending] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useDocumentTitle("Мои объявления");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchMyAdverts()
      .then((list) => {
        if (active) setItems(list);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const counts = useMemo(() => {
    const result = { all: items.length };

    STATUS_TABS.forEach((statusTab) => {
      if (statusTab.value === "all") return;

      result[statusTab.value] = items.filter(
        (item) => item.status === statusTab.value,
      ).length;
    });

    return result;
  }, [items]);

  const views = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.views_count || 0), 0),
    [items],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return items.filter((item) => {
      if (tab !== "all" && item.status !== tab) return false;
      if (!term) return true;

      return (
        String(item.title || "").toLowerCase().includes(term) ||
        String(item.text || "").toLowerCase().includes(term)
      );
    });
  }, [items, tab, query]);

  const selectTab = (value) => {
    setTab(value);

    if (value === "all") setSearchParams({}, { replace: true });
    else setSearchParams({ status: value }, { replace: true });
  };

  const handleAction = useCallback((advert, action) => {
    setPending({ advert, action });
  }, []);

  const confirmAction = async () => {
    if (!pending) return;

    setActionLoading(true);

    try {
      if (pending.action === "delete") {
        await deleteAdvert(pending.advert.id);
        toast.success("Объявление удалено", "Его больше не видно в списке.");
      } else {
        await changeAdvertStatus(pending.advert.id, pending.action);

        const messages = {
          moderation: "Объявление отправлено на модерацию",
          archive: "Объявление в архиве",
          draft: "Объявление возвращено в черновик",
        };

        toast.success(messages[pending.action] || "Статус обновлён");
      }

      setPending(null);
      setReloadToken((token) => token + 1);
    } catch (requestError) {
      toast.error("Не удалось выполнить действие", getApiErrorMessage(requestError));
    } finally {
      setActionLoading(false);
    }
  };

  const meta = pending ? ACTIONS[pending.action] : null;

  return (
    <main className="page my-page">
      <div className="container">
        <header className="my-head">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1>Мои объявления</h1>
            <p>
              Управляйте публикациями: редактируйте черновики, отправляйте на
              модерацию и продвигайте объявления.
            </p>
          </div>

          <Link to="/adverts/new" className="btn btn--primary btn--lg">
            <Icon name="plus" size={17} />
            Новое объявление
          </Link>
        </header>

        <div className="my-stats">
          <div className="my-stat">
            <span className="my-stat__icon">
              <Icon name="layers" size={18} />
            </span>
            <div>
              <strong>{items.length}</strong>
              <span>Всего объявлений</span>
            </div>
          </div>
          <div className="my-stat">
            <span className="my-stat__icon my-stat__icon--green">
              <Icon name="check-circle" size={18} />
            </span>
            <div>
              <strong>{counts.published || 0}</strong>
              <span>Опубликовано</span>
            </div>
          </div>
          <div className="my-stat">
            <span className="my-stat__icon my-stat__icon--amber">
              <Icon name="edit" size={18} />
            </span>
            <div>
              <strong>{counts.draft || 0}</strong>
              <span>Черновиков</span>
            </div>
          </div>
          <div className="my-stat">
            <span className="my-stat__icon my-stat__icon--violet">
              <Icon name="eye" size={18} />
            </span>
            <div>
              <strong>{views}</strong>
              <span>Просмотров</span>
            </div>
          </div>
        </div>

        <div className="my-toolbar">
          <div className="status-tabs" role="group" aria-label="Фильтр по статусу">
            {STATUS_TABS.map((statusTab) => (
              <button
                key={statusTab.value}
                type="button"
                className={`status-tab${tab === statusTab.value ? " is-active" : ""}`}
                onClick={() => selectTab(statusTab.value)}
                aria-pressed={tab === statusTab.value}
              >
                {statusTab.label}
                <span>{counts[statusTab.value] || 0}</span>
              </button>
            ))}
          </div>

          <label className="my-search">
            <span className="sr-only">Поиск по моим объявлениям</span>
            <span className="input-group">
              <span className="input-group__icon" aria-hidden="true">
                <Icon name="search" size={16} />
              </span>
              <input
                type="search"
                className="input"
                placeholder="Поиск по названию"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="input-group__action"
                  onClick={() => setQuery("")}
                  aria-label="Очистить поиск"
                >
                  <Icon name="close" size={14} />
                </button>
              ) : null}
            </span>
          </label>
        </div>

        {loading ? (
          <div className="my-skeletons" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="my-skeleton" key={index}>
                <div className="skeleton my-skeleton__media" />
                <div className="my-skeleton__body">
                  <div className="skeleton skeleton--line" style={{ width: 90 }} />
                  <div className="skeleton skeleton--title" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line" style={{ width: "55%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Не удалось загрузить объявления"
            description="Проверьте соединение и попробуйте ещё раз."
            onRetry={() => setReloadToken((token) => token + 1)}
          />
        ) : filtered.length ? (
          <>
            <p className="my-count">
              {filtered.length}{" "}
              {plural(filtered.length, ["объявление", "объявления", "объявлений"])}
              {tab !== "all"
                ? ` · ${STATUS_TABS.find((item) => item.value === tab)?.label.toLowerCase()}`
                : ""}
            </p>

            <ul className="my-list">
              {filtered.map((advert) => (
                <MyAdvertRow
                  key={advert.id}
                  advert={advert}
                  onAction={handleAction}
                  busy={actionLoading}
                />
              ))}
            </ul>
          </>
        ) : items.length === 0 ? (
          <EmptyState
            icon="layers"
            title="У вас пока нет объявлений"
            description="Разместите первое объявление — это бесплатно. Оно появится в каталоге после модерации."
            action={
              <Link to="/adverts/new" className="btn btn--primary">
                <Icon name="plus" size={16} />
                Создать объявление
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon="search"
            title="Ничего не найдено"
            description={
              query
                ? "Попробуйте изменить поисковый запрос или выбрать другой статус."
                : "В этом статусе пока нет объявлений. Выберите другой фильтр."
            }
            action={
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => {
                  setQuery("");
                  selectTab("all");
                }}
              >
                Показать все
              </button>
            }
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => {
          if (!actionLoading) setPending(null);
        }}
        onConfirm={confirmAction}
        title={meta?.title || ""}
        description={meta?.description}
        confirmLabel={meta?.confirmLabel}
        icon={meta?.icon}
        tone={meta?.tone}
        loading={actionLoading}
      >
        {pending ? (
          <div className="my-confirm">
            <div className="my-confirm__media">
              <AdvertMedia
                src={pending.advert.photos?.[0]}
                alt=""
                category={pending.advert.category}
              />
            </div>
            <div>
              <strong>{pending.advert.title}</strong>
              <span>{formatPrice(pending.advert.price)}</span>
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </main>
  );
}
