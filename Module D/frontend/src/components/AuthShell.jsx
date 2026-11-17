import Brand from "./Brand";
import Icon from "./Icon";

const FEATURES = [
  {
    icon: "shield-check",
    title: "Проверенные объявления",
    text: "Каждая публикация проходит модерацию перед выходом в каталог.",
  },
  {
    icon: "rocket",
    title: "Продвижение TOP и VIP",
    text: "Поднимайте объявления выше и получайте больше просмотров.",
  },
  {
    icon: "layers",
    title: "Всё под контролем",
    text: "Черновики, модерация и статистика — в личном кабинете.",
  },
];

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <div className="container auth">
        <aside className="auth-aside">
          <div className="auth-aside__glow" aria-hidden="true" />

          <Brand />

          <div className="auth-aside__content">
            <span className="eyebrow eyebrow--light">Geek Market</span>
            <h2>
              Покупайте, продавайте и находите <em>нужное рядом</em>
            </h2>
            <p>
              Тысячи объявлений в одном месте. Создайте аккаунт, чтобы управлять
              публикациями и продвигать их.
            </p>
          </div>

          <ul className="auth-aside__features">
            {FEATURES.map((feature) => (
              <li key={feature.title}>
                <span aria-hidden="true">
                  <Icon name={feature.icon} size={17} />
                </span>
                <div>
                  <strong>{feature.title}</strong>
                  <small>{feature.text}</small>
                </div>
              </li>
            ))}
          </ul>

          <p className="auth-aside__note">
            <Icon name="info" size={14} />
            Демонстрационный проект WorldSkills Kazakhstan 2025
          </p>
        </aside>

        <section className="auth-card">
          <header className="auth-card__head">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </header>

          {children}

          {footer ? <footer className="auth-card__footer">{footer}</footer> : null}
        </section>
      </div>
    </main>
  );
}
