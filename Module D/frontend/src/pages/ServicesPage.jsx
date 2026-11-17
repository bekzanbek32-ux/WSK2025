import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAdvert, getCachedAdvert } from "../api/adverts";
import { getApiErrorMessage, isForbidden } from "../api/client";
import { fetchPaidServices, purchasePaidService } from "../api/services";
import AdvertMedia from "../components/AdvertMedia";
import ConfirmDialog from "../components/ConfirmDialog";
import Icon from "../components/Icon";
import StatusBadge, { ServiceBadge } from "../components/StatusBadge";
import { ErrorState, PageLoader } from "../components/States";
import { PAID_SERVICES, getPaidService } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  daysLeft,
  isAdvertOwner,
  isServiceActive,
  normalizeService,
} from "../utils/adverts";
import { formatDate, formatPrice, plural } from "../utils/format";
import "./ServicesPage.css";

function ServiceCard({ service, activeRecord, expiredRecord, disabled, onBuy }) {
  const active = Boolean(activeRecord);
  const left = activeRecord ? daysLeft(activeRecord.expired_at) : 0;

  return (
    <article className={`service-card service-card--${service.name}`}>
      <div className="service-card__head">
        <span className="service-card__icon" aria-hidden="true">
          <Icon name={service.name === "vip" ? "crown" : "zap"} size={24} />
        </span>
        <ServiceBadge name={service.name} />
        {active ? <span className="badge badge--green service-card__state">Активна</span> : null}
      </div>

      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__tagline">{service.tagline}</p>

      <div className="service-card__price">
        <strong>{formatPrice(service.price)}</strong>
        <span>
          / {service.days} {plural(service.days, ["день", "дня", "дней"])}
        </span>
      </div>

      <p className="service-card__description">{service.description}</p>

      <ul className="service-card__benefits">
        {service.benefits.map((benefit) => (
          <li key={benefit}>
            <Icon name="check" size={14} />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="service-card__status">
        {active ? (
          <>
            <span className="service-card__status-title">
              <Icon name="clock" size={15} />
              Активна до {formatDate(activeRecord.expired_at, { short: true })}
            </span>
            <span className="service-card__status-hint">
              Осталось {left} {plural(left, ["день", "дня", "дней"])}. Продление
              станет доступно после окончания срока.
            </span>
          </>
        ) : expiredRecord ? (
          <>
            <span className="service-card__status-title">
              <Icon name="refresh" size={15} />
              Прошлая услуга завершилась
            </span>
            <span className="service-card__status-hint">
              Период закончился {formatDate(expiredRecord.expired_at, { short: true })}.
              Можно подключить снова на {service.days}{" "}
              {plural(service.days, ["день", "дня", "дней"])}.
            </span>
          </>
        ) : (
          <>
            <span className="service-card__status-title">
              <Icon name="info" size={15} />
              Услуга не подключена
            </span>
            <span className="service-card__status-hint">
              Активация происходит сразу после подтверждения.
            </span>
          </>
        )}
      </div>

      <button
        type="button"
        className={`btn btn--block ${service.name === "vip" ? "btn--primary" : "btn--dark"}`}
        onClick={() => onBuy(service)}
        disabled={active || disabled}
      >
        <Icon name={active ? "check" : "credit-card"} size={16} />
        {active
          ? "Услуга активна"
          : expiredRecord
            ? `Продлить за ${formatPrice(service.price)}`
            : `Подключить за ${formatPrice(service.price)}`}
      </button>
    </article>
  );
}

export default function ServicesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const cached = getCachedAdvert(id);

  const [advert, setAdvert] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesToken, setServicesToken] = useState(0);
  const [confirmService, setConfirmService] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const owner = isAdvertOwner(advert, user);

  useDocumentTitle(
    advert ? `Продвижение «${advert.title}»` : "Платные услуги",
  );

  useEffect(() => {
    let active = true;

    if (!getCachedAdvert(id)) setLoading(true);
    setError(null);

    fetchAdvert(id)
      .then((data) => {
        if (active) setAdvert(data);
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
  }, [id]);

  useEffect(() => {
    if (!advert?.id) return undefined;

    let active = true;

    setServicesLoading(true);
    setForbidden(false);

    fetchPaidServices(advert.id)
      .then((list) => {
        if (active) setServices(list.map(normalizeService));
      })
      .catch((requestError) => {
        if (!active) return;

        if (isForbidden(requestError)) setForbidden(true);
      })
      .finally(() => {
        if (active) setServicesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [advert?.id, servicesToken]);

  const servicesByName = useMemo(() => {
    const result = {};

    services.forEach((service) => {
      if (!result[service.name]) result[service.name] = [];

      result[service.name].push(service);
    });

    Object.values(result).forEach((list) => {
      list.sort(
        (a, b) =>
          new Date(String(b.expired_at).replace(" ", "T")).getTime() -
          new Date(String(a.expired_at).replace(" ", "T")).getTime(),
      );
    });

    return result;
  }, [services]);

  const activeServices = useMemo(
    () => services.filter(isServiceActive),
    [services],
  );

  const getServiceRecords = useCallback(
    (name) => {
      const list = servicesByName[name] || [];

      return {
        activeRecord: list.find(isServiceActive) || null,
        expiredRecord: list.find((record) => !isServiceActive(record)) || null,
      };
    },
    [servicesByName],
  );

  const handlePurchase = async () => {
    if (!confirmService || !advert) return;

    setPurchasing(true);

    try {
      await purchasePaidService(advert.id, confirmService.name);
      toast.success(
        `${confirmService.label} подключён`,
        `Услуга будет активна ${confirmService.days} ${plural(confirmService.days, ["день", "дня", "дней"])}.`,
      );
      setConfirmService(null);
      setServicesToken((token) => token + 1);
    } catch (requestError) {
      const status = requestError.response?.status;

      toast.error(
        status === 422 ? "Услуга уже активна" : "Не удалось подключить услугу",
        status === 422
          ? "Дождитесь окончания текущего периода — продление станет доступно позже."
          : getApiErrorMessage(requestError),
      );
    } finally {
      setPurchasing(false);
    }
  };

  if (loading && !advert) {
    return (
      <main className="page">
        <div className="container">
          <PageLoader label="Загружаем объявление..." />
        </div>
      </main>
    );
  }

  if (error || !advert) {
    return (
      <main className="page">
        <div className="container">
          <ErrorState
            title="Объявление не найдено"
            description="Не удалось открыть объявление для настройки продвижения. Вернитесь в список своих объявлений."
          />
          <div className="services-error-actions">
            <Link to="/my-adverts" className="btn btn--primary">
              Мои объявления
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (forbidden || !owner) {
    return (
      <main className="page">
        <div className="container">
          <ErrorState
            title="Продвижение доступно только автору"
            description="Платные услуги можно подключить лишь для собственного объявления. Откройте «Мои объявления», чтобы выбрать своё."
          />
          <div className="services-error-actions">
            <Link to={`/adverts/${advert.id}`} className="btn btn--outline">
              Вернуться к объявлению
            </Link>
            <Link to="/my-adverts" className="btn btn--primary">
              Мои объявления
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const servicesList = Array.isArray(services) ? services : [];

  return (
    <main className="page services-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Навигационная цепочка">
          <Link to="/my-adverts">Мои объявления</Link>
          <Icon name="chevron-right" size={13} />
          <Link to={`/adverts/${advert.id}`}>{advert.title}</Link>
          <Icon name="chevron-right" size={13} />
          <span aria-current="page">Продвижение</span>
        </nav>

        <header className="services-hero">
          <div>
            <span className="eyebrow eyebrow--light">Платные услуги</span>
            <h1>Поднимите объявление выше</h1>
            <p>
              TOP и VIP показывают ваше предложение большему числу покупателей.
              Услуги активируются сразу после подтверждения — без ожидания
              модерации оплаты.
            </p>
          </div>

          <div className="services-hero__advert">
            <div className="services-hero__media">
              <AdvertMedia
                src={advert.photos?.[0]}
                alt={advert.title}
                category={advert.category}
              />
            </div>
            <div className="services-hero__info">
              <span>Продвигаемое объявление</span>
              <strong>{advert.title}</strong>
              <div className="services-hero__meta">
                <StatusBadge status={advert.status} />
                <span>{formatPrice(advert.price)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="services-layout">
          <section className="services-main" aria-labelledby="choose-service-title">
            <div className="services-main__head">
              <div>
                <h2 id="choose-service-title">Выберите услугу</h2>
                <p>
                  Можно подключить TOP и VIP одновременно — они дополняют друг
                  друга.
                </p>
              </div>
              {servicesLoading ? <span className="spinner services-main__spinner" /> : null}
            </div>

            <div className="service-cards">
              {PAID_SERVICES.map((service) => {
                const { activeRecord, expiredRecord } = getServiceRecords(service.name);

                return (
                  <ServiceCard
                    key={service.name}
                    service={service}
                    activeRecord={activeRecord}
                    expiredRecord={expiredRecord}
                    disabled={purchasing}
                    onBuy={setConfirmService}
                  />
                );
              })}
            </div>

            <div className="service-note">
              <Icon name="shield-check" size={18} />
              <div>
                <strong>Оплата в демонстрационном режиме</strong>
                <p>
                  Платёжный шлюз не подключён: услуга активируется сразу, а
                  стоимость отображается для примера. Продление доступно только
                  после окончания текущего периода.
                </p>
              </div>
            </div>
          </section>

          <aside className="services-aside">
            <section className="services-summary">
              <h2>Активные услуги</h2>

              {activeServices.length ? (
                <ul className="services-summary__list">
                  {activeServices.map((service, index) => {
                    const meta = getPaidService(service.name);
                    const left = daysLeft(service.expired_at);

                    return (
                      <li key={`${service.name}-${index}`}>
                        <ServiceBadge name={service.name} />
                        <div>
                          <strong>{meta?.title || service.name}</strong>
                          <span>
                            до {formatDate(service.expired_at, { short: true })} ·{" "}
                            {left} {plural(left, ["день", "дня", "дней"])}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : servicesLoading ? (
                <p className="services-summary__empty">Проверяем услуги...</p>
              ) : (
                <p className="services-summary__empty">
                  Активных услуг пока нет. Выберите TOP или VIP — объявление
                  станет заметнее.
                </p>
              )}

              {servicesList.length > activeServices.length ? (
                <details className="services-summary__history">
                  <summary>История услуг</summary>
                  <ul>
                    {servicesList
                      .filter((service) => !isServiceActive(service))
                      .map((service, index) => (
                        <li key={`history-${service.name}-${index}`}>
                          <ServiceBadge name={service.name} />
                          <span>
                            до {formatDate(service.expired_at, { short: true })}
                          </span>
                        </li>
                      ))}
                  </ul>
                </details>
              ) : null}
            </section>

            <section className="services-steps">
              <h2>Как это работает</h2>
              <ol>
                <li>
                  <span>1</span>
                  Выберите услугу и подтвердите подключение.
                </li>
                <li>
                  <span>2</span>
                  Услуга активируется мгновенно и появляется на карточке.
                </li>
                <li>
                  <span>3</span>
                  После окончания срока подключите продление.
                </li>
              </ol>
            </section>

            {advert.status !== "published" ? (
              <div className="alert alert--warning">
                <Icon name="alert-circle" size={17} />
                <div className="alert__body">
                  <span className="alert__title">Объявление ещё не опубликовано</span>
                  <span className="alert__text">
                    Продвижение начнёт действовать в каталоге после публикации.
                  </span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmService)}
        onClose={() => {
          if (!purchasing) setConfirmService(null);
        }}
        onConfirm={handlePurchase}
        title={confirmService ? `Подключить ${confirmService.label}?` : ""}
        description={
          confirmService
            ? `${confirmService.title} на ${confirmService.days} ${plural(confirmService.days, ["день", "дня", "дней"])}.`
            : ""
        }
        icon={confirmService?.name === "vip" ? "crown" : "zap"}
        confirmLabel={confirmService ? `Оплатить ${formatPrice(confirmService.price)}` : "Оплатить"}
        loading={purchasing}
      >
        {confirmService ? (
          <div className="purchase-summary">
            <div>
              <span>Объявление</span>
              <strong>{advert.title}</strong>
            </div>
            <div>
              <span>Услуга</span>
              <strong>
                {confirmService.title} · {confirmService.days}{" "}
                {plural(confirmService.days, ["день", "дня", "дней"])}
              </strong>
            </div>
            <div>
              <span>Стоимость</span>
              <strong>{formatPrice(confirmService.price)}</strong>
            </div>
            <div>
              <span>Оплата</span>
              <strong>Демо-режим, без списания</strong>
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </main>
  );
}
