import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  useDocumentTitle("Страница не найдена");

  return (
    <main className="page notfound-page">
      <div className="container notfound">
        <div className="notfound__art" aria-hidden="true">
          <span className="notfound__404">404</span>
          <span className="notfound__badge">
            <Icon name="search" size={26} />
          </span>
        </div>

        <span className="eyebrow">Ошибка 404</span>
        <h1>Такой страницы не существует</h1>
        <p>
          Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную
          или посмотрите свежие объявления в каталоге.
        </p>

        <div className="notfound__actions">
          <Link to="/" className="btn btn--primary btn--lg">
            <Icon name="home" size={17} />
            На главную
          </Link>
          <Link to="/#catalog" className="btn btn--outline btn--lg">
            <Icon name="search" size={17} />
            В каталог
          </Link>
        </div>

        <nav className="notfound__links" aria-label="Полезные ссылки">
          <Link to="/adverts/new">
            <Icon name="plus" size={15} />
            Разместить объявление
          </Link>
          <Link to="/my-adverts">
            <Icon name="layers" size={15} />
            Мои объявления
          </Link>
          <Link to="/profile">
            <Icon name="user" size={15} />
            Профиль
          </Link>
        </nav>
      </div>
    </main>
  );
}
