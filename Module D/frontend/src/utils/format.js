const wholePriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** "$1,200" — or "Договорная" when the seller leaves the price at zero. */
export function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) return "—";
  if (price === 0) return "Договорная";

  return Number.isInteger(price)
    ? wholePriceFormatter.format(price)
    : priceFormatter.format(price);
}

/** "12 ноября 2026 г." */
export function formatDate(value, { short = false } = {}) {
  const date = parseDate(value);

  if (!date) return "—";

  return (short ? shortDateFormatter : dateFormatter).format(date);
}

/** "12.11.2026, 14:35" */
export function formatDateTime(value) {
  const date = parseDate(value);

  if (!date) return "—";

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseDate(value) {
  if (!value) return null;

  // The API returns "2026-11-05 02:48:45" (no timezone) — Safari needs the "T".
  const normalized =
    typeof value === "string" && value.includes(" ")
      ? value.replace(" ", "T")
      : value;

  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

/** Russian pluralisation: 1 объявление / 2 объявления / 5 объявлений */
export function plural(count, [one, few, many]) {
  const value = Math.abs(Number(count)) % 100;
  const last = value % 10;

  if (value > 10 && value < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;

  return many;
}

/** "Показать телефон" never exposes more than the first four digits. */
export function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.length <= 4) return `+${digits}`;

  return `+${digits.slice(0, 4)} ••• ••• ••`;
}

export function formatPhone(phone) {
  return String(phone || "").trim();
}

export function initials(name) {
  return String(name || "GM")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, "");
}
