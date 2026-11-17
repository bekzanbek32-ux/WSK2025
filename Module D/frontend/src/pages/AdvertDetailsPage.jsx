import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAdvert, fetchAdverts, getCachedAdvert } from "../api/adverts";
import { isNotFound } from "../api/client";
import { fetchPaidServices } from "../api/services";
import AdvertCard from "../components/AdvertCard";
import Carousel from "../components/Carousel";
import Icon from "../components/Icon";
import StatusBadge, { ServiceBadge } from "../components/StatusBadge";
import { ErrorState } from "../components/States";
import { getPaidService } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  daysLeft,
  getActiveServices,
  isAdvertOwner,
  isServiceActive,
  normalizeService,
} from "../utils/adverts";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  maskPhone,
  plural,
} from "../utils/format";
import "./AdvertDetailsPage.css";

function DetailSkeleton() {
  return (
    <div className="detail-skeleton" aria-hidden="true">
      <div className="skeleton skeleton--line" style={{ width: 150 }} />
      <div className="skeleton skeleton--title" style={{ width: "62%", height: 38, marginTop: 18 }} />
      <div className="detail-skeleton__grid">
        <div className="skeleton detail-skeleton__media" />
        <div className="detail-skeleton__side">
          <div className="skeleton detail-skeleton__card" />
          <div className="skeleton detail-skeleton__card" />
        </div>
      </div>
    </div>
  );
}

export default function AdvertDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const cached = getCachedAdvert(id);

  const [advert, setAdvert] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [phoneShown, setPhoneShown] = useState(false);

  const owner = isAdvertOwner(advert, user);
  const activeServices = useMemo(() => getActiveServices(services), [services]);

  useDocumentTitle(advert?.title || "Объявление");

  useEffect(() => {
    let active = true;

    if (!getCachedAdvert(id)) setLoading(true);
    setError(null);
    setPhoneShown(false);

    fetchAdvert(id)
      .then((data) => {
        if (!active) return;

        if (!data) {
          setError(new Error("not-found"));
          return;
        }

        setAdvert(data);
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
  }, [id, reloadToken]);

  useEffect(() => {
    if (!advert?.id) return undefined;

    let active = true;

    setServices([]);

    if (!owner) {
      setServicesLoading(false);
      return undefined;
    }

    setServicesLoading(true);

    fetchPaidServices(advert.id)
      .then((list) => {
        if (active) setServices(list.map(normalizeService));
      })
      .catch(() => {
        // Services are optional information: hide the block when unavailable.
      })
      .finally(() => {
        if (active) setServicesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [advert?.id, owner]);

  useEffect(() => {
    if (!advert?.category_id) return undefined;

    let active = true;

    fetchAdverts({ category_id: advert.category_id, per_page: 30 })
      .then((result) => {
        if (!active) return;

        setSimilar(
          result.items
            .filter((item) => String(item.id) !== String(advert.id))
            .slice(0, 4),
        );
      })
      .catch(() => {
        if (active) setSimilar([]);
      });

    return () => {
      active = false;
    };
  }, [advert?.category_id, advert?.id]);

  const copyPhone = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(advert?.user?.phone || "");
      toast.success("Телефон скопирован");
    } catch {
      toast.error("Не удалось скопировать", "Выделите номер и скопируйте вручную.");
    }
  }, [advert?.user?.phone, toast]);

  if (loading && !advert) {
    return (
      <main className="page detail-page">
        <div className="container">
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  if (error || !advert) {
    const notFound = !advert || isNotFound(error);

    return (
      <main className="page detail-page">
        <div className="container">
          <ErrorState
            title={notFound ? "Объявление не найдено" : "Не удалось открыть объявление"}
            description={
              notFound
                ? "Возможно, объявление сняли с публикации или удалили. Посмотрите другие предложения в каталоге."
                : "Проверьте подключение к интернету и попробуйте ещё раз."
            }
            onRetry={notFound ? undefined : () => setReloadToken((token) => token + 1)}
          />
          {notFound ? (
            <div className="detail-error__actions">
              <Link to="/" className="btn btn--primary">
                Перейти в каталог
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    );
  }

  const phone = advert.user?.phone || "";
  const categoryName = advert.category?.name || "Без категории";
  const photos = advert.photos || [];

  return (
    <main className="page detail-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Навигационная цепочка">
          <Link to="/">Главная</Link>
          <Icon name="chevron-right" size={13} />
          <Link to={advert.category_id ? `/?category=${advert.category_id}#catalog` : "/#catalog"}>
            {categoryName}
          </Link>
          <Icon name="chevron-right" size={13} />
          <span aria-current="page">{advert.title}</span>
        </nav>

        <header className="detail-head">
          <div className="detail-head__main">
            <div className="detail-head__badges">
              <span className="badge badge--violet">{categoryName}</span>
              {getActiveServices(services).length && owner
                ? getActiveServices(services).map((service) => (
                    <ServiceBadge key={service.name} name={service.name} />
                  ))
                : null}
              {owner ? <StatusBadge status={advert.status} /> : null}
            </div>

            <h1 className="detail-head__title">{advert.title}</h1>

            <div className="detail-head__meta">
              <span>
                <Icon name="calendar" size={15} />
                {formatDate(advert.created_at)}
              </span>
              <span>
                <Icon name="eye" size={15} />
                {Number(advert.views_count || 0)}{" "}
                {plural(Number(advert.views_count || 0), ["просмотр", "просмотра", "просмотров"])}
              </span>
              <span>
                <Icon name="tag" size={15} />
                ID {advert.id}
              </span>
            </div>
          </div>

          <div className="detail-head__price">
            <span>Цена</span>
            <strong>{formatPrice(advert.price)}</strong>
            {Number(advert.price) === 0 ? <small>Цена договорная</small> : null}
          </div>
        </header>

        <div className="detail-grid">
          <div className="detail-main">
            <Carousel photos={photos} alt={advert.title} category={advert.category} />

            <section className="detail-panel" aria-labelledby="description-title">
              <h2 id="description-title">Описание</h2>
              <p className="detail-panel__text">{advert.text}</p>
            </section>

            <section className="detail-panel" aria-labelledby="specs-title">
              <h2 id="specs-title">Характеристики</h2>
              <dl className="detail-specs">
                <div>
                  <dt>Категория</dt>
                  <dd>{categoryName}</dd>
                </div>
                <div>
                  <dt>Цена</dt>
                  <dd>{formatPrice(advert.price)}</dd>
                </div>
                <div>
                  <dt>Опубликовано</dt>
                  <dd>{formatDateTime(advert.created_at)}</dd>
                </div>
                <div>
                  <dt>Обновлено</dt>
                  <dd>{formatDateTime(advert.updated_at || advert.created_at)}</dd>
                </div>
                <div>
                  <dt>Фотографий</dt>
                  <dd>{photos.length || "Нет"}</dd>
                </div>
                <div>
                  <dt>Номер объявления</dt>
                  <dd>#{advert.id}</dd>
                </div>
              </dl>
            </section>
          </div>

          <aside className="detail-aside">
            <section className="seller-card" aria-labelledby="seller-title">
              <div className="seller-card__top">
                <span className="seller-card__avatar" aria-hidden="true">
                  <Icon name="user" size={23} />
                </span>
                <div className="seller-card__identity">
                  <span className="seller-card__label">Продавец</span>
                  <h2 id="seller-title">{advert.user?.name || "Пользователь Geek Market"}</h2>
                  <span className="seller-card__since">
                    {advert.user?.created_at
                      ? `На сайте с ${formatDate(advert.user.created_at, { short: true })}`
                      : "Проверенный участник"}
                  </span>
                </div>
              </div>

              <div className="seller-card__contact">
                <span className="seller-card__contact-label">Телефон</span>

                {phone ? (
                  <>
                    <div className="phone-box">
                      <Icon name="phone" size={18} />
                      <span className="phone-box__value">
                        {phoneShown ? phone : maskPhone(phone)}
                      </span>
                      {phoneShown ? (
                        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="phone-box__action" aria-label="Позвонить">
                          <Icon name="arrow-up-right" size={16} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="phone-box__action"
                          onClick={() => setPhoneShown(true)}
                          aria-label="Показать телефон"
                        >
                          <Icon name="eye" size={16} />
                        </button>
                      )}
                    </div>

                    {phoneShown ? (
                      <div className="seller-card__phone-actions">
                        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn btn--primary btn--block">
                          <Icon name="phone" size={16} />
                          Позвонить
                        </a>
                        <button type="button" className="btn btn--outline" onClick={copyPhone} aria-label="Скопировать номер">
                          <Icon name="layers" size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => setPhoneShown(false)}
                          aria-label="Скрыть телефон"
                        >
                          <Icon name="eye-off" size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--primary btn--block"
                        onClick={() => setPhoneShown(true)}
                      >
                        <Icon name="phone" size={16} />
                        Показать телефон
                      </button>
                    )}

                    <p className="seller-card__note">
                      {phoneShown
                        ? "Скажите продавцу, что нашли объявление на Geek Market."
                        : "Показываем только первые цифры — полный номер откроется по кнопке."}
                    </p>
                  </>
                ) : (
                  <p className="seller-card__note">Продавец не указал телефон.</p>
                )}
              </div>

              <div className="seller-card__actions">
                <Link
                  to={`/adverts/${advert.id}/services`}
                  className="btn btn--outline btn--block"
                >
                  <Icon name="rocket" size={16} />
                  Купить продвижение
                </Link>

                {owner ? (
                  advert.status === "draft" ? (
                    <Link to={`/adverts/${advert.id}/edit`} className="btn btn--dark btn--block">
                      <Icon name="edit" size={16} />
                      Редактировать объявление
                    </Link>
                  ) : (
                    <Link to="/my-adverts" className="btn btn--dark btn--block">
                      <Icon name="layers" size={16} />
                      Управлять объявлением
                    </Link>
                  )
                ) : null}

                {!isAuthenticated ? (
                  <p className="seller-card__note seller-card__note--center">
                    <Link to="/login" className="link">
                      Войдите
                    </Link>{" "}
                    или{" "}
                    <Link to="/register" className="link">
                      создайте аккаунт
                    </Link>
                    , чтобы размещать объявления.
                  </p>
                ) : null}
              </div>
            </section>

            {owner ? (
              <section className="detail-services" aria-labelledby="services-title">
                <div className="detail-services__head">
                  <h2 id="services-title">Платные услуги</h2>
                  {services.length ? <span>{services.length}</span> : null}
                </div>

                {servicesLoading ? (
                  <div className="detail-services__loading">
                    <span className="spinner" />
                    Загружаем услуги...
                  </div>
                ) : services.length ? (
                  <ul className="detail-services__list">
                    {services.map((service, index) => {
                      const meta = getPaidService(service.name);
                      const active = isServiceActive(service);
                      const left = daysLeft(service.expired_at);

                      return (
                        <li key={`${service.name}-${index}`} className="detail-service-row">
                          <div>
                            <ServiceBadge name={service.name} />
                            <span className="detail-service-row__name">
                              {meta?.title || service.name}
                            </span>
                          </div>
                          <div className="detail-service-row__meta">
                            <span className={active ? "text-success" : ""}>
                              {active
                                ? `Активна ещё ${left} ${plural(left, ["день", "дня", "дней"])}`
                                : "Срок истёк"}
                            </span>
                            <span>{formatDate(service.expired_at, { short: true })}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="detail-services__empty">
                    Продвижение не подключено. TOP и VIP помогают объявлению
                    подняться выше в каталоге.
                  </p>
                )}

                <Link to={`/adverts/${advert.id}/services`} className="link detail-services__link">
                  {activeServices.length ? "Управлять услугами" : "Подключить услугу"}
                  <Icon name="arrow-right" size={15} />
                </Link>
              </section>
            ) : null}

            <section className="safety-card">
              <span className="safety-card__icon" aria-hidden="true">
                <Icon name="shield-check" size={21} />
              </span>
              <div>
                <h2>Безопасная сделка</h2>
                <p>
                  Встречайтесь в людных местах и проверяйте товар до оплаты.
                  Не переводите предоплату незнакомым продавцам.
                </p>
              </div>
            </section>
          </aside>
        </div>

        {similar.length ? (
          <section className="detail-similar" aria-labelledby="similar-title">
            <div className="section-head">
              <div>
                <span className="eyebrow">Похожие предложения</span>
                <h2 className="section-head__title" id="similar-title">
                  Ещё в категории «{categoryName}»
                </h2>
              </div>

              <Link to={`/?category=${advert.category_id}#catalog`} className="link">
                Все объявления
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>

            <div className="advert-grid">
              {similar.map((item) => (
                <AdvertCard advert={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
