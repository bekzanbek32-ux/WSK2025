import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import { PageLoader } from "./components/States";
import { useAuth } from "./context/AuthContext";
import AdvertDetailsPage from "./pages/AdvertDetailsPage";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyAdvertsPage from "./pages/MyAdvertsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="container">
        <PageLoader label="Проверяем сессию..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  if (initializing) {
    return (
      <div className="container">
        <PageLoader label="Проверяем сессию..." />
      </div>
    );
  }

  if (isAuthenticated) {
    const target = from?.pathname
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : "/";

    return <Navigate to={target} replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />

      <div className="app-main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/adverts/new" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="/adverts/:id" element={<AdvertDetailsPage />} />
            <Route
              path="/adverts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adverts/:id/services"
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-adverts"
              element={
                <ProtectedRoute>
                  <MyAdvertsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </div>

      <Footer />
    </div>
  );
}
