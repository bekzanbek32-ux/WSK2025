import { Link } from "react-router-dom";
import { CONTACT } from "../constants";
import Brand from "./Brand";
import Icon from "./Icon";
import "./Footer.css";

const YEAR = new Date().getFullYear();

const CATALOG_LINKS = [
  { label: "Все объявления", to: "/#catalog" },
  { label: "Категории", to: "/#categories" },
  { label: "Как это работает", to: "/#how" },
];

const SELLER_LINKS = [
  { label: "Разместить объявление", to: "/adverts/new" },
  { label: "Мои объявления", to: "/my-adverts" },
  { label: "Профиль", to: "/profile" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <Brand />
          <p>
            Geek Market — площадка объявлений, где покупатели и продавцы
            находят друг друга без лишних шагов.
          </p>

          <div className="site-footer__contact">
            <a href={CONTACT.phoneHref} className="site-footer__contact-item">
              <Icon name="phone" size={15} />
              {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="site-footer__contact-item">
              <Icon name="send" size={15} />
              {CONTACT.email}
            </a>
            <span className="site-footer__contact-item">
              <Icon name="clock" size={15} />
              {CONTACT.hours}
            </span>
          </div>
        </div>

        <div className="site-footer__columns">
          <nav className="site-footer__column" aria-label="Каталог">
            <h3>Каталог</h3>
            {CATALOG_LINKS.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="site-footer__column" aria-label="Продавцам">
            <h3>Продавцам</h3>
            {SELLER_LINKS.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-footer__column">
            <h3>Поддержка</h3>
            <a href={CONTACT.phoneHref}>Позвонить</a>
            <a href={`mailto:${CONTACT.email}`}>Написать</a>
            <Link to="/#how">Правила продвижения</Link>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© {YEAR} Geek Market. Все права защищены.</span>
        <span className="site-footer__demo">
          Демонстрационный проект · WorldSkills Kazakhstan 2025
        </span>
      </div>
    </footer>
  );
}
