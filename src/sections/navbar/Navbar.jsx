import React from "react";
import "./navbar.css";
import $ from "jquery";

const navbar = () => {
  const colorm = () => {
    let colors = [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
    ];

    let random = Math.floor(Math.random() * colors.length);
    if ($("#colorm").html() === "Default Mode") {
      $("nav").removeAttr("style");
      colors.splice(random, random);
      $("section").each(function () {
        $(this).css("backgroundColor", "#f6c94e");
      });
      $("footer").removeAttr("style");
      colors.splice(random, random);
      $("#colorm").html("Color Mode");
    } else {
      colors = [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#2c3e50",
        "#f1c40f",
        "#e67e22",
      ];
      $("nav").attr("style", `background-color: ${colors[random]} !important`);
      colors.splice(random, 1);
      $("section").each(function () {
        random = Math.floor(Math.random() * colors.length);
        $(this).css("backgroundColor", `${colors[random]}`);
        colors.splice(random, 1);
      });
      random = Math.floor(Math.random() * colors.length);
      $("footer").attr(
        "style",
        `background-color: ${colors[random]} !important`
      );
      colors.splice(random, 1);
      $("#colorm").html("Default Mode");
    }
  };

  return (
    <nav
      id="navbar"
      className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
    >
      <a className="navbar-brand" href="https://www.cdtio.com">
        cd /tio/root
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse ml-2"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link text-white" href="#header">
              About
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#portfolio">
              Portfolio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>
      <ul className="navbar-nav ml-auto text-white" id="bloglink">
        <li className="nav-item my-auto mr-2">
          <a id="colorm" onClick={colorm}>
            Color Mode
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default navbar;
