import axios from "axios";

const FALLBACK_API_URL = "http://127.0.0.1:8000/api";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || FALLBACK_API_URL
).replace(/\/+$/, "");

export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "http://127.0.0.1:8000";
  }
})();

export const TOKEN_KEY = "geek-market.token";

export const AUTH_EVENT = "geek-market:unauthorized";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent(AUTH_EVENT));
    }

    return Promise.reject(error);
  },
);

/** Converts a stored photo value into a browser-usable URL. */
export function toAssetUrl(path) {
  if (!path) return "";

  const value = String(path).trim();

  if (!value) return "";

  if (/^(data|blob):/i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/storage/")) return `${API_ORIGIN}${value}`;
  if (value.startsWith("storage/")) return `${API_ORIGIN}/${value}`;
  if (value.startsWith("/")) return `${API_ORIGIN}${value}`;

  return `${API_ORIGIN}/storage/${value.replace(/^\/+/, "")}`;
}

export function getApiErrorMessage(
  error,
  fallback = "Что-то пошло не так. Попробуйте ещё раз.",
) {
  if (!error?.response) {
    return "Сервер недоступен. Проверьте подключение к интернету и повторите попытку.";
  }

  const { status, data } = error.response;
  const serverMessage = data?.message || data?.error;

  if (status === 401) return "Требуется вход в аккаунт.";
  if (status === 403) {
    return serverMessage || "Недостаточно прав для выполнения этого действия.";
  }
  if (status === 404) {
    return "Запись не найдена. Возможно, она была удалена.";
  }
  if (status === 422) {
    const firstFieldError = Object.values(data?.errors || {})[0];

    if (Array.isArray(firstFieldError)) return firstFieldError[0];
    if (typeof firstFieldError === "string") return firstFieldError;

    return serverMessage || "Проверьте правильность заполнения полей.";
  }
  if (status === 429) {
    return "Слишком много запросов. Подождите немного и попробуйте снова.";
  }
  if (status >= 500) {
    return "Ошибка на стороне сервера. Попробуйте позже.";
  }

  return serverMessage || fallback;
}

/** Laravel validation errors → { field: message }. */
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;

  if (!errors || typeof errors !== "object") return {};

  return Object.entries(errors).reduce((result, [field, messages]) => {
    const key = field.split(".")[0];
    const message = Array.isArray(messages) ? messages[0] : messages;

    if (key && message) result[key] = String(message);

    return result;
  }, {});
}

export function isUnauthorized(error) {
  return error?.response?.status === 401;
}

export function isForbidden(error) {
  return error?.response?.status === 403;
}

export function isNotFound(error) {
  return error?.response?.status === 404;
}

/** Drops empty values so we never send `?query=` to the API. */
export function cleanParams(params = {}) {
  return Object.entries(params).reduce((result, [key, value]) => {
    if (value === "" || value === null || value === undefined) return result;

    result[key] = value;

    return result;
  }, {});
}

export default api;
