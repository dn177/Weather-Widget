import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import PageLoader from "./ui/PageLoader";

// Lazy load components for better performance
const Home = lazy(() => import("./ui/Home"));

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
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
