import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppLayout from "./ui/AppLayout";
import PageLoader from "./ui/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load components for better performance
const Home = lazy(() => import("./ui/Home"));

// Shown if the Home chunk fails to load (e.g. a stale reference after a
// redeploy) or throws while rendering. AppLayout, mounted in the same tree,
// already relies on i18n being ready this early, so this can too.
const HomeErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <div role="alert" className="route-error-fallback">
      <p>{t("common.errorBoundary.message")}</p>
      <button type="button" onClick={() => window.location.reload()}>
        {t("common.errorBoundary.reload")}
      </button>
    </div>
  );
};

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: (
            <ErrorBoundary fallback={<HomeErrorFallback />}>
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          ),
        },
      ],
    },
  ],
  // Strip the deploy subpath ("/react/") before matching routes, so paths stay
  // root-relative. Mirrors Vite's base; one source of truth.
  { basename: import.meta.env.BASE_URL }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
