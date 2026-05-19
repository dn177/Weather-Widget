import { lazy, Suspense } from "react";
import Header from "../sections/header/Header";
import Portfolio from "../sections/portfolio/Portfolio";
import Badges from "../sections/badges/Badges";
import Hustle from "../sections/hustle/Hustle";
import Contact from "../sections/contacts/Contact";
import Sustainability from "../sections/sustainability/Sustainability";
import Astronaut from "../components/Astronaut";
import SolarSystem from "../components/SolarSystem";
import PageLoader from "./PageLoader";

// Lazy load heavier components
const Pixelperfect = lazy(() =>
  import("../sections/pixelperfect/Pixelperfect")
);
const Footer = lazy(() => import("../sections/footer/Footer"));

const Home = () => {
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
      <Astronaut />
      {/* <SolarSystem /> */}
    </>
  );
};

export default Home;
