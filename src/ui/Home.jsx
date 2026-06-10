import { lazy, Suspense } from "react";
import Header from "../sections/header/Header";
import Portfolio from "../sections/portfolio/Portfolio";
import Badges from "../sections/badges/Badges";
import Hustle from "../sections/hustle/Hustle";
import Contact from "../sections/contacts/Contact";
import Sustainability from "../sections/sustainability/Sustainability";
import PageLoader from "./PageLoader";
import useInView from "../hooks/useInView";

// Lazy load heavier components
const Pixelperfect = lazy(() =>
  import("../sections/pixelperfect/Pixelperfect")
);
// The three.js scene is the heaviest chunk on the page and sits at the very
// bottom — its code (three + gsap + 2.3k LOC scene) only downloads once the
// visitor scrolls near it.
const Astronaut = lazy(() => import("../components/Astronaut"));

const Home = () => {
  const [astronautRef, astronautInView] = useInView("600px");

  return (
    <>
      <Header />
      <Portfolio />
      <Suspense fallback={<PageLoader label="Loading content" />}>
        <Pixelperfect />
      </Suspense>
      <Badges />
      <Hustle />
      <Sustainability />
      <Contact />
      {/* Placeholder keeps the page height stable until the scene mounts. */}
      <div ref={astronautRef} style={{ minHeight: "100vh" }}>
        {astronautInView && (
          <Suspense fallback={null}>
            <Astronaut />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default Home;
