import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { initials } from "../utils/format";
import Brand from "./Brand";
import Icon from "./Icon";
import "./Header.css";

const NAV_ITEMS = [
  { key: "home", to: "/", label: "Главная" },
  { key: "catalog", to: "/#catalog", label: "Каталог" },
  { key: "how", to: "/#how", label: "Как это работает" },
  { key: "my", to: "/my-adverts", label: "Мои объявления" },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isActive = (key) => {
    if (key === "catalog") {
      return location.pathname === "/" && location.hash === "#catalog";
    }

    if (key === "how") {
      return location.pathname === "/" && location.hash === "#how";
    }

    if (key === "home") {
      return location.pathname === "/" && location.hash !== "#catalog" && location.hash !== "#how";
    }

    return location.pathname.startsWith("/my-adverts");
  };

  const handleSectionClick = (item) => (event) => {
    if (location.pathname !== "/") return;

    event.preventDefault();
    setMobileOpen(false);

    const hash = item.to.split("#")[1];

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(hash);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `/#${hash}`);
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileOpen(false);
    // Navigate away first so the protected route guard does not redirect to
    // /login while the session state is being cleared.
    navigate("/", { replace: true });
    await logout();
    toast.success("Вы вышли из аккаунта");
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />

        <nav className="nav" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`nav__link${isActive(item.key) ? " is-active" : ""}`}
              onClick={handleSectionClick(item)}
              aria-current={isActive(item.key) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/adverts/new" className="btn btn--primary btn--sm header-cta">
                <Icon name="plus" size={16} />
                Разместить
              </Link>

              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="avatar">{initials(user?.name || user?.email)}</span>
                  <span className="user-menu__name">
                    {user?.name || user?.email || "Профиль"}
                  </span>
                  <Icon name="chevron-down" size={14} />
                </button>

                {menuOpen ? (
                  <div className="user-menu__dropdown" role="menu">
                    <div className="user-menu__header">
                      <strong>{user?.name || "Ваш профиль"}</strong>
                      <span className="user-menu__email">
                        {user?.email || user?.phone || ""}
                      </span>
                    </div>

                    <Link to="/profile" className="menu-item" role="menuitem">
                      <Icon name="user" size={16} />
                      Профиль
                    </Link>
                    <Link to="/my-adverts" className="menu-item" role="menuitem">
                      <Icon name="layers" size={16} />
                      Мои объявления
                    </Link>
                    <Link to="/adverts/new" className="menu-item" role="menuitem">
                      <Icon name="plus" size={16} />
                      Новое объявление
                    </Link>

                    <div className="menu-divider" />

                    <button
                      type="button"
                      className="menu-item menu-item--danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <Icon name="logout" size={16} />
                      Выйти
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm header-login">
                Войти
              </Link>
              <Link to="/adverts/new" className="btn btn--primary btn--sm">
                <Icon name="plus" size={16} />
                Разместить объявление
              </Link>
            </>
          )}

          <button
            type="button"
            className="burger"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav" id="mobile-navigation">
          <nav className="mobile-nav__links" aria-label="Мобильная навигация">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`mobile-nav__link${isActive(item.key) ? " is-active" : ""}`}
                onClick={handleSectionClick(item)}
              >
                {item.label}
                <Icon name="chevron-right" size={17} />
              </Link>
            ))}
          </nav>

          <div className="mobile-nav__actions">
            {isAuthenticated ? (
              <>
                <Link to="/adverts/new" className="btn btn--primary btn--block">
                  <Icon name="plus" size={16} />
                  Разместить объявление
                </Link>
                <Link to="/profile" className="btn btn--outline btn--block">
                  <Icon name="user" size={16} />
                  Профиль
                </Link>
                <button
                  type="button"
                  className="btn btn--ghost btn--block"
                  onClick={handleLogout}
                >
                  <Icon name="logout" size={16} />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--outline btn--block">
                  Войти
                </Link>
                <Link to="/register" className="btn btn--primary btn--block">
                  Создать аккаунт
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
