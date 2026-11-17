import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { fetchAdverts } from "../api/adverts";
import { fetchCategories } from "../api/categories";
import AdvertCard from "../components/AdvertCard";
import Icon from "../components/Icon";
import { CardSkeletons, EmptyState, ErrorState } from "../components/States";
import { getCategoryIcon, getCategoryTone, SORT_OPTIONS } from "../constants";
import useDebounce from "../hooks/useDebounce";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { plural } from "../utils/format";
import "./HomePage.css";

const PAGE_SIZE = 10;
const EMPTY_FILTERS = {
  query: "",
  category: "all",
  priceFrom: "",
  priceTo: "",
  sort: "new",
};

function readFilters(searchParams) {
  return {
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    priceFrom: searchParams.get("price_from") || "",
    priceTo: searchParams.get("price_to") || "",
    sort: SORT_OPTIONS.some((option) => option.value === searchParams.get("sort"))
      ? searchParams.get("sort")
      : "new",
  };
}

function getSortParams(sort) {
  if (sort === "price-asc") return { sort_by: "price", sort: "asc" };
  if (sort === "price-desc") return { sort_by: "price", sort: "desc" };

  return { sort_by: "date", sort: "desc" };
}

function getPageNumbers(current, last) {
  const pages = new Set([1, last, current, current - 1, current + 1]);

  return [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1));
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState({ items: [], total: 0, lastPage: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const catalogRef = useRef(null);

  const debouncedFilters = useDebounce(filters, 350);

  useDocumentTitle("Маркетплейс объявлений");

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {
        // Categories are optional for filtering: the text search keeps working.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const hasItems = result.items.length > 0;

    if (hasItems) setRefreshing(true);
    else setLoading(true);

    setError(null);

    fetchAdverts({
      ...getSortParams(debouncedFilters.sort),
      query: debouncedFilters.query.trim(),
      category_id: debouncedFilters.category === "all" ? "" : debouncedFilters.category,
      price_from: debouncedFilters.priceFrom,
      price_to: debouncedFilters.priceTo,
      page,
      per_page: PAGE_SIZE,
    })
      .then((data) => {
        if (!active) return;

        if (data.lastPage >= 1 && page > data.lastPage) {
          setPage(data.lastPage);
          return;
        }

        setResult(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (!active) return;

        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters, page, reloadToken]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.query.trim()) params.set("q", debouncedFilters.query.trim());
    if (debouncedFilters.category !== "all") params.set("category", debouncedFilters.category);
    if (debouncedFilters.priceFrom !== "") params.set("price_from", debouncedFilters.priceFrom);
    if (debouncedFilters.priceTo !== "") params.set("price_to", debouncedFilters.priceTo);
    if (debouncedFilters.sort !== "new") params.set("sort", debouncedFilters.sort);
    if (page > 1) params.set("page", String(page));

    const next = params.toString();
    const current = window.location.search.replace(/^\?/, "");

    if (`${next}` !== current) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedFilters, page, setSearchParams]);

  useEffect(() => {
    if (!location.hash) return undefined;

    const id = location.hash.replace("#", "");
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash, categories.length]);

  const updateFilter = useCallback((field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToPage = useCallback(
    (nextPage) => {
      if (nextPage === page) return;

      setPage(nextPage);
      window.setTimeout(scrollToCatalog, 60);
    },
    [page, scrollToCatalog],
  );

  const categoryName = useMemo(() => {
    if (filters.category === "all") return "";

    return (
      categories.find((category) => String(category.id) === String(filters.category))?.name ||
      "Категория"
    );
  }, [categories, filters.category]);

  const activeFilters = useMemo(() => {
    const chips = [];

    if (filters.query.trim()) {
      chips.push({ key: "query", label: `«${filters.query.trim()}»`, reset: () => updateFilter("query", "") });
    }

    if (filters.category !== "all") {
      chips.push({ key: "category", label: categoryName, reset: () => updateFilter("category", "all") });
    }

    if (filters.priceFrom !== "") {
      chips.push({ key: "from", label: `от $${filters.priceFrom}`, reset: () => updateFilter("priceFrom", "") });
    }

    if (filters.priceTo !== "") {
      chips.push({ key: "to", label: `до $${filters.priceTo}`, reset: () => updateFilter("priceTo", "") });
    }

    return chips;
  }, [filters, categoryName, updateFilter]);

  const hasFilters = activeFilters.length > 0 || filters.sort !== "new";
  const pages = getPageNumbers(result.currentPage, result.lastPage);

  return (
    <main className="home">
      <div className="container">
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">Маркетплейс объявлений</span>

            <h1 className="hero__title">
              Покупайте, продавайте и находите <em>нужное рядом</em>
            </h1>

            <p className="hero__lead">
              Geek Market собирает объявления в одном месте. Ищите по категориям,
              цене и ключевым словам, публикуйте за пару минут и продвигайте
              свои предложения наверх.
            </p>

            <div className="hero__actions">
              <button type="button" className="btn btn--light btn--lg" onClick={scrollToCatalog}>
                Смотреть каталог
                <Icon name="arrow-right" size={17} />
              </button>
              <Link to="/adverts/new" className="btn btn--hero-outline btn--lg">
                <Icon name="plus" size={17} />
                Разместить объявление
              </Link>
            </div>

            <dl className="hero__stats">
              <div>
                <dt>Категорий</dt>
                <dd>{categories.length || 10}</dd>
              </div>
              <div>
                <dt>Публикация</dt>
                <dd>Бесплатно</dd>
              </div>
              <div>
                <dt>Доступ</dt>
                <dd>24/7</dd>
              </div>
            </dl>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__glow" />

            <div className="hero-card">
              <div className="hero-card__media">
                <Icon name="monitor" size={58} strokeWidth={1.2} />
                <span className="badge badge--violet hero-card__badge">VIP</span>
              </div>

              <div className="hero-card__body">
                <span className="hero-card__category">Электроника</span>
                <strong className="hero-card__title">iPhone 13 Pro</strong>
                <div className="hero-card__bottom">
                  <span className="hero-card__price">$750</span>
                  <span className="hero-card__meta">Сегодня</span>
                </div>
              </div>
            </div>

            <div className="hero-pill hero-pill--top">
              <Icon name="shield-check" size={17} />
              Проверенные продавцы
            </div>

            <div className="hero-pill hero-pill--bottom">
              <Icon name="trending-up" size={17} />
              ТОП — больше просмотров
            </div>
          </div>
        </section>

        <section className="categories" id="categories" aria-labelledby="categories-title">
          <div className="section-head">
            <div>
              <span className="eyebrow">Исследуйте</span>
              <h2 className="section-head__title" id="categories-title">
                Популярные категории
              </h2>
              <p className="section-head__lead">
                Выберите направление — объявления подстроятся под ваш интерес.
              </p>
            </div>

            <button type="button" className="link" onClick={scrollToCatalog}>
              Все объявления
              <Icon name="arrow-right" size={16} />
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const isActive = String(filters.category) === String(category.id);

              return (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card category-card--${getCategoryTone(category)}${isActive ? " is-active" : ""}`}
                  onClick={() => {
                    updateFilter("category", isActive ? "all" : category.id);
                    scrollToCatalog();
                  }}
                  aria-pressed={isActive}
                >
                  <span className="category-card__icon" aria-hidden="true">
                    <Icon name={getCategoryIcon(category.name)} size={21} />
                  </span>
                  <span className="category-card__name">{category.name}</span>
                  <span className="category-card__cta">
                    {isActive ? "Фильтр активен" : "Смотреть"}
                    <Icon name="arrow-up-right" size={13} />
                  </span>
                </button>
              );
            })}

            {!categories.length ? (
              <div className="category-grid__loading">
                <span className="spinner" /> Загружаем категории...
              </div>
            ) : null}
          </div>
        </section>

        <section className="catalog" id="catalog" ref={catalogRef} aria-labelledby="catalog-title">
          <div className="section-head section-head--catalog">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2 className="section-head__title" id="catalog-title">
                Свежие объявления
              </h2>
              <p className="section-head__lead">
                Только опубликованные объявления — от новых к старым.
              </p>
            </div>

            <div className="catalog__counter" aria-live="polite">
              <strong>{result.total}</strong>
              <span>{plural(result.total, ["объявление", "объявления", "объявлений"])}</span>
            </div>
          </div>

          <form
            className={`filters${refreshing ? " is-refreshing" : ""}`}
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="filter-control filter-control--search">
              <span className="filter-control__label">Ключевые слова</span>
              <span className="input-group">
                <span className="input-group__icon" aria-hidden="true">
                  <Icon name="search" size={17} />
                </span>
                <input
                  type="search"
                  className="input"
                  placeholder="Например, iPhone или квартира"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  autoComplete="off"
                />
                {filters.query ? (
                  <button
                    type="button"
                    className="input-group__action"
                    onClick={() => updateFilter("query", "")}
                    aria-label="Очистить поиск"
                  >
                    <Icon name="close" size={15} />
                  </button>
                ) : null}
              </span>
            </label>

            <label className="filter-control">
              <span className="filter-control__label">Категория</span>
              <select
                className="select"
                value={filters.category}
                onChange={(event) => updateFilter("category", event.target.value)}
              >
                <option value="all">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="filter-control">
              <span className="filter-control__label" id="price-label">
                Цена, $
              </span>
              <div className="price-range" role="group" aria-labelledby="price-label">
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="От"
                  aria-label="Минимальная цена"
                  value={filters.priceFrom}
                  onChange={(event) => updateFilter("priceFrom", event.target.value)}
                />
                <span aria-hidden="true">—</span>
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="До"
                  aria-label="Максимальная цена"
                  value={filters.priceTo}
                  onChange={(event) => updateFilter("priceTo", event.target.value)}
                />
              </div>
            </div>

            <label className="filter-control">
              <span className="filter-control__label">Сортировка</span>
              <select
                className="select"
                value={filters.sort}
                onChange={(event) => updateFilter("sort", event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="btn btn--outline filter-reset"
              onClick={resetFilters}
              disabled={!hasFilters}
            >
              <Icon name="refresh" size={15} />
              Сбросить
            </button>
          </form>

          {activeFilters.length ? (
            <div className="active-filters">
              <span className="active-filters__label">Активные фильтры:</span>
              {activeFilters.map((chip) => (
                <button
                  type="button"
                  className="active-filters__chip"
                  key={chip.key}
                  onClick={chip.reset}
                >
                  {chip.label}
                  <Icon name="close" size={12} />
                  <span className="sr-only">Убрать фильтр</span>
                </button>
              ))}
              <button type="button" className="active-filters__clear" onClick={resetFilters}>
                Сбросить всё
              </button>
            </div>
          ) : null}

          {error && result.items.length ? (
            <div className="alert alert--error catalog__alert" role="alert">
              <Icon name="alert-circle" size={17} />
              <div className="alert__body">
                <span className="alert__title">Не удалось обновить список</span>
                <span className="alert__text">
                  Показаны ранее загруженные объявления.
                </span>
              </div>
              <button
                type="button"
                className="btn btn--sm btn--outline"
                onClick={() => setReloadToken((token) => token + 1)}
              >
                Повторить
              </button>
            </div>
          ) : null}

          {loading ? (
            <CardSkeletons count={6} />
          ) : error ? (
            <ErrorState
              title="Каталог временно недоступен"
              description="Не получилось загрузить объявления. Проверьте соединение и попробуйте ещё раз."
              onRetry={() => setReloadToken((token) => token + 1)}
            />
          ) : result.items.length === 0 ? (
            <EmptyState
              icon="search"
              title="Ничего не найдено"
              description="Попробуйте изменить ключевые слова, категорию или диапазон цены."
              action={
                hasFilters ? (
                  <button type="button" className="btn btn--primary" onClick={resetFilters}>
                    Сбросить фильтры
                  </button>
                ) : (
                  <Link to="/adverts/new" className="btn btn--primary">
                    <Icon name="plus" size={16} />
                    Разместить объявление
                  </Link>
                )
              }
            />
          ) : (
            <>
              <div className="advert-grid">
                {result.items.map((advert) => (
                  <AdvertCard advert={advert} key={advert.id} />
                ))}
              </div>

              {result.lastPage > 1 ? (
                <nav className="pagination" aria-label="Постраничная навигация">
                  <button
                    type="button"
                    className="pagination__button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Предыдущая страница"
                  >
                    <Icon name="chevron-left" size={16} />
                  </button>

                  {pages.map((pageNumber, index) => {
                    const previous = pages[index - 1];
                    const showGap = previous && pageNumber - previous > 1;

                    return (
                      <span className="pagination__item" key={pageNumber}>
                        {showGap ? <span className="pagination__gap">…</span> : null}
                        <button
                          type="button"
                          className="pagination__button"
                          onClick={() => goToPage(pageNumber)}
                          aria-current={pageNumber === page ? "page" : undefined}
                        >
                          {pageNumber}
                        </button>
                      </span>
                    );
                  })}

                  <button
                    type="button"
                    className="pagination__button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= result.lastPage}
                    aria-label="Следующая страница"
                  >
                    <Icon name="chevron-right" size={16} />
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </section>

        <section className="how" id="how" aria-labelledby="how-title">
          <div className="section-head">
            <div>
              <span className="eyebrow">Как это работает</span>
              <h2 className="section-head__title" id="how-title">
                Три шага до первой сделки
              </h2>
              <p className="section-head__lead">
                Публикация бесплатна — платить нужно только за продвижение.
              </p>
            </div>
          </div>

          <div className="how-grid">
            <article className="how-card">
              <span className="how-card__icon" aria-hidden="true">
                <Icon name="edit" size={21} />
              </span>
              <span className="how-card__step">Шаг 1</span>
              <h3>Создайте объявление</h3>
              <p>
                Добавьте название, описание, цену, категорию и фотографии.
                Черновик сохраняется и не виден другим.
              </p>
            </article>

            <article className="how-card">
              <span className="how-card__icon" aria-hidden="true">
                <Icon name="shield-check" size={21} />
              </span>
              <span className="how-card__step">Шаг 2</span>
              <h3>Пройдите модерацию</h3>
              <p>
                Отправьте объявление на проверку. После одобрения оно появится
                в каталоге и станет доступно покупателям.
              </p>
            </article>

            <article className="how-card">
              <span className="how-card__icon" aria-hidden="true">
                <Icon name="rocket" size={21} />
              </span>
              <span className="how-card__step">Шаг 3</span>
              <h3>Продвигайте и продавайте</h3>
              <p>
                Подключите TOP на 3 дня или VIP на 7 дней, чтобы объявление
                увидело больше людей.
              </p>
            </article>
          </div>
        </section>

        <section className="home-cta">
          <div>
            <span className="eyebrow eyebrow--light">Ваше объявление</span>
            <h2>Есть что продать? Покажите это всем.</h2>
            <p>
              Создайте объявление за пару минут — это бесплатно. А если хотите
              больше просмотров, подключите продвижение.
            </p>
          </div>

          <div className="home-cta__actions">
            <Link to="/adverts/new" className="btn btn--light btn--lg">
              <Icon name="plus" size={17} />
              Разместить объявление
            </Link>
            <Link to="/register" className="btn btn--hero-outline btn--lg">
              Создать аккаунт
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
