import { Link } from "react-router-dom";
import { getCategoryTone } from "../constants";
import { getActiveServices } from "../utils/adverts";
import { formatDate, formatPrice, stripHtml } from "../utils/format";
import AdvertMedia from "./AdvertMedia";
import Icon from "./Icon";
import { ServiceBadge } from "./StatusBadge";
import "./AdvertCard.css";

export default function AdvertCard({ advert }) {
  const photos = advert.photos || [];
  const tone = getCategoryTone(advert.category);
  const services = getActiveServices(advert.paidServices).map((service) => service.name);
  const description = stripHtml(advert.text);

  return (
    <article className="advert-card">
      <Link
        to={`/adverts/${advert.id}`}
        className="advert-card__link"
        aria-label={`Открыть объявление «${advert.title}»`}
      >
        <div className={`advert-card__media advert-card__media--${tone}`}>
          <AdvertMedia
            src={photos[0]}
            alt={advert.title}
            category={advert.category}
            className="advert-card__image"
          />

          <div className="advert-card__badges">
            {services.map((service) => (
              <ServiceBadge key={service} name={service} />
            ))}
          </div>

          {photos.length > 1 ? (
            <span className="advert-card__photo-count">
              <Icon name="image" size={13} />
              {photos.length}
            </span>
          ) : null}
        </div>

        <div className="advert-card__body">
          <div className="advert-card__meta">
            <span className="advert-card__category">
              {advert.category?.name || "Без категории"}
            </span>
            <time dateTime={advert.created_at || undefined}>
              {formatDate(advert.created_at, { short: true })}
            </time>
          </div>

          <h3 className="advert-card__title">{advert.title}</h3>

          <p className="advert-card__description">
            {description || "Описание отсутствует"}
          </p>

          <div className="advert-card__footer">
            <strong className="advert-card__price">{formatPrice(advert.price)}</strong>
            <span className="advert-card__more">
              Подробнее
              <Icon name="arrow-up-right" size={15} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
