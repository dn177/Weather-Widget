import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./sections/navbar/Navbar";
import Header from "./sections/header/Header";
import Portfolio from "./sections/portfolio/Portfolio";
import Badges from "./sections/badges/Badges";
import Contact from "./sections/contacts/Contact";

const App = () => {
  return (
    <main>
      <Navbar />
      <Header />
      <Portfolio />
      <Badges />
      <Contact />
    </main>
  );
};

export default App;
