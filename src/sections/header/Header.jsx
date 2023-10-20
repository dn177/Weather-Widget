import React from "react";
import data from "./data";
import "./header.css";

const Header = () => {
  return (
    <header id="header">
      <div className="container header__container">
        <h3 data-aos="fade-up">Daniel M</h3>
        <p data-aos="fade-up">Hit me up for some web stuff.</p>
        <div className="header__cta" data-aos="fade-up">
          <a href="#contact" className="btn primary">
            Let's Talk
          </a>
          <a href="#portfolio" className="btn light">
            My Work
          </a>
        </div>
        <div className="header__socials mt-5">
          {
            // data.map(item => <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">{item.icon}</a>)
            <a
              key={data[3].id}
              href={data[3].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data[3].icon}
            </a>
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
