import api from "./client";

/**
 * Module C exposes auth routes at the API root (/login, /register, /logout).
 * Some builds nest them under /auth/*; try the real routes first and fall
 * back only when the server answers 404.
 */
async function requestWithFallback(method, paths, payload) {
  let lastError;

  for (const path of paths) {
    try {
      return await api.request({ method, url: path, data: payload });
    } catch (error) {
      lastError = error;

      if (error.response?.status !== 404) throw error;
    }
  }

  throw lastError;
}

export async function registerUser({ name, email, phone, password }) {
  const { data } = await requestWithFallback(
    "post",
    ["/register", "/auth/register"],
    { name, email, phone, password },
  );

  return {
    token: data?.access_token || data?.token || "",
    user: data?.user || null,
  };
}

export async function loginUser({ login, password }) {
  const { data } = await requestWithFallback(
    "post",
    ["/login", "/auth/login"],
    { login, password },
  );

  return {
    token: data?.access_token || data?.token || "",
    user: data?.user || null,
  };
}

export async function logoutUser() {
  const response = await requestWithFallback("post", ["/logout", "/auth/logout"]);

  return response.data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/user");

  return data?.user || data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch("/user", payload);

  return data?.user || data;
}
