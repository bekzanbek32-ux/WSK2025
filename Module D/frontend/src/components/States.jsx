import Icon from "./Icon";

export function PageLoader({ label = "Загружаем данные..." }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div>
        <div className="spinner spinner--lg" aria-hidden="true" />
      </div>
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ icon = "search", title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Не удалось загрузить данные", description, onRetry }) {
  return (
    <div className="state-block" role="alert">
      <span className="state-block__icon" aria-hidden="true">
        <Icon name="alert-triangle" size={26} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry ? (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          <Icon name="refresh" size={16} />
          Повторить
        </button>
      ) : null}
    </div>
  );
}

export function AdvertCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton--line" style={{ width: "38%" }} />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" style={{ width: "64%" }} />
        <div className="skeleton skeleton--line" style={{ width: "46%", marginTop: 10 }} />
      </div>
    </div>
  );
}

export function CardSkeletons({ count = 6 }) {
  return (
    <div className="advert-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <AdvertCardSkeleton key={index} />
      ))}
    </div>
  );
}
