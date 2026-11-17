import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../api/auth";
import { AUTH_EVENT, TOKEN_KEY } from "../api/client";
import { useToast } from "./ToastContext";

const USER_KEY = "geek-market.user";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const toast = useToast();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => (localStorage.getItem(TOKEN_KEY) ? readStoredUser() : null));
  const [initializing, setInitializing] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const tokenRef = useRef(token);
  const hadSession = useRef(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setInitializing(false);

      return undefined;
    }

    let active = true;

    setInitializing(true);

    fetchCurrentUser()
      .then((freshUser) => {
        if (!active || !freshUser) return;

        setUser(freshUser);
        persistUser(freshUser);
        hadSession.current = true;
      })
      .catch(() => {
        // 401 is handled by the axios interceptor; other errors keep the
        // cached profile so a flaky network does not log the user out.
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!tokenRef.current) return;

      localStorage.removeItem(TOKEN_KEY);
      persistUser(null);
      setToken("");
      setUser(null);
      setInitializing(false);

      if (hadSession.current) {
        toast.info("Сессия истекла", "Войдите снова, чтобы продолжить работу.");
      }

      hadSession.current = false;
    };

    window.addEventListener(AUTH_EVENT, handleUnauthorized);

    return () => window.removeEventListener(AUTH_EVENT, handleUnauthorized);
  }, [toast]);

  const applySession = useCallback(({ token: accessToken, user: profile }) => {
    if (!accessToken) {
      throw new Error("Сервер не вернул токен доступа");
    }

    localStorage.setItem(TOKEN_KEY, accessToken);
    persistUser(profile || null);
    hadSession.current = true;
    setToken(accessToken);
    setUser(profile || null);

    return profile;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const session = await loginUser(credentials);

      return applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (payload) => {
      const session = await registerUser(payload);

      return applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // The token is removed locally even if the API is unreachable.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      persistUser(null);
      hadSession.current = false;
      setToken("");
      setUser(null);
    }
  }, []);

  const saveProfile = useCallback(async (payload) => {
    const updated = await updateProfile(payload);
    const merged = { ...(updated || {}) };

    setUser((current) => {
      const next = { ...current, ...merged };

      persistUser(next);

      return next;
    });

    return merged;
  }, []);

  const refreshUser = useCallback(async () => {
    const fresh = await fetchCurrentUser();

    setUser(fresh);
    persistUser(fresh);

    return fresh;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      saveProfile,
      refreshUser,
    }),
    [user, token, initializing, login, register, logout, saveProfile, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
