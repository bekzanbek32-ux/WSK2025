export const APP_NAME = "Geek Market";

export const CONTACT = {
  phone: "+7 777 123 4567",
  phoneHref: "tel:+77771234567",
  email: "hello@geekmarket.kz",
  hours: "Ежедневно, 09:00 — 21:00",
};

export const ADVERT_STATUSES = {
  draft: {
    label: "Черновик",
    tone: "gray",
    hint: "Виден только вам. Можно редактировать и отправить на модерацию.",
  },
  moderation: {
    label: "На модерации",
    tone: "amber",
    hint: "Объявление проверяет модератор. Редактирование временно недоступно.",
  },
  published: {
    label: "Опубликовано",
    tone: "green",
    hint: "Объявление видно всем посетителям каталога.",
  },
  declined: {
    label: "Отклонено",
    tone: "red",
    hint: "Модератор отклонил объявление. Верните его в черновик и исправьте.",
  },
  archived: {
    label: "В архиве",
    tone: "slate",
    hint: "Объявление скрыто из каталога. Из архива его можно удалить.",
  },
};

export const STATUS_TABS = [
  { value: "all", label: "Все" },
  { value: "draft", label: "Черновики" },
  { value: "moderation", label: "На модерации" },
  { value: "published", label: "Опубликованы" },
  { value: "declined", label: "Отклонены" },
  { value: "archived", label: "Архив" },
];

export const PAID_SERVICES = [
  {
    name: "top",
    label: "TOP",
    title: "ТОП каталога",
    days: 3,
    price: 4.99,
    tone: "amber",
    tagline: "Поднимает объявление в начало каталога",
    description:
      "Объявление закрепляется выше обычных публикаций в выбранной категории.",
    benefits: [
      "Первые позиции в каталоге",
      "Больше просмотров и откликов",
      "Метка TOP на карточке",
    ],
  },
  {
    name: "vip",
    label: "VIP",
    title: "VIP-размещение",
    days: 7,
    price: 9.99,
    tone: "violet",
    tagline: "Максимальная видимость на неделю",
    description:
      "VIP-объявление выделяется в выдаче и показывается в приоритетном блоке каталога.",
    benefits: [
      "Приоритетный блок каталога",
      "Выделенная VIP-карточка",
      "Максимальный охват за 7 дней",
    ],
  },
];

export function getPaidService(name) {
  const normalized = String(name || "").toLowerCase();

  return PAID_SERVICES.find((service) => service.name === normalized);
}

export const CATEGORY_ICONS = [
  { match: ["real estate", "недвижим", "квартир", "дом"], icon: "home" },
  { match: ["vehicle", "auto", "car", "транспорт", "авто"], icon: "car" },
  { match: ["job", "вакан", "работа"], icon: "briefcase" },
  { match: ["service", "услуг"], icon: "wrench" },
  { match: ["electronic", "техник", "электрон"], icon: "monitor" },
  { match: ["personal", "личн"], icon: "bag" },
  { match: ["hobb", "хобби", "увлеч"], icon: "sparkles" },
  { match: ["animal", "pet", "животн"], icon: "heart" },
  { match: ["home", "garden", "сад", "интерьер"], icon: "leaf" },
  { match: ["business", "equipment", "бизнес", "оборуд"], icon: "chart" },
];

export function getCategoryIcon(name) {
  const normalized = String(name || "").toLowerCase();
  const preset = CATEGORY_ICONS.find(({ match }) =>
    match.some((word) => normalized.includes(word)),
  );

  return preset?.icon || "tag";
}

/** Stable pastel tone for a category, based on its id or name. */
export function getCategoryTone(category) {
  const source = String(category?.id ?? category?.name ?? category ?? "0");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 997;
  }

  return (hash % 5) + 1;
}

export const SORT_OPTIONS = [
  { value: "new", label: "Сначала новые" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
];
