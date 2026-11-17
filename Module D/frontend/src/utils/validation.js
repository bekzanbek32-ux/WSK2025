const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function required(value, message = "Заполните поле") {
  return String(value ?? "").trim() ? "" : message;
}

export function validateName(value) {
  const empty = required(value, "Укажите имя");

  if (empty) return empty;
  if (String(value).trim().length < 2) return "Имя должно содержать минимум 2 символа";

  return "";
}

export function validateEmail(value) {
  const empty = required(value, "Укажите e-mail");

  if (empty) return empty;
  if (!EMAIL_PATTERN.test(String(value).trim())) return "Введите корректный e-mail";

  return "";
}

export function validatePhone(value) {
  const digits = digitsOnly(value);

  if (!digits) return "Укажите номер телефона";
  if (digits.length < 10 || digits.length > 15) {
    return "Введите номер в формате +7 700 123 45 67";
  }

  return "";
}

export function validatePassword(value) {
  if (!value) return "Придумайте пароль";
  if (String(value).length < 8) return "Пароль должен содержать минимум 8 символов";
  if (String(value).length > 50) return "Пароль не должен превышать 50 символов";

  return "";
}

export function validateLogin(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) return "Укажите e-mail или телефон";

  const looksLikeEmail = trimmed.includes("@");

  return looksLikeEmail ? validateEmail(trimmed) : validatePhone(trimmed);
}

export function validatePrice(value, { required: isRequired = true } = {}) {
  const raw = String(value ?? "").trim();

  if (!raw) return isRequired ? "Укажите цену" : "";

  const price = Number(raw);

  if (!Number.isFinite(price)) return "Цена должна быть числом";
  if (price < 0) return "Цена не может быть отрицательной";

  return "";
}

export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/** "8 777 123 45 67" → "+77771234567" */
export function normalizePhone(value) {
  let digits = digitsOnly(value);

  if (digits.length === 11 && digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  return digits ? `+${digits}` : "";
}

/** Runs a map of field → validator and returns an object of errors. */
export function runValidators(values, rules) {
  return Object.entries(rules).reduce((errors, [field, validator]) => {
    const message = validator(values[field], values);

    if (message) errors[field] = message;

    return errors;
  }, {});
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
