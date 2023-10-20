import React from "react";
import "./badges.css";
import JBadge from "../../assets/Badges/JBadge.png";
import FBadge from "../../assets/Badges/FrontendBadge.png";
import CBadge from "../../assets/Badges/CSSBadge.png";

function Badges() {
  return (
    <section id="badges">
      <h2 class="mb-4 text-center">Some badges.</h2>
      <h3 class="mb-5 text-center"> Who cares? I don't, but maybe you do.</h3>
      <div className="img-wrapper d-flex justify-content-between mx-auto">
        <img className="badge-img" src={FBadge} alt="" />
        <img
          className="badge-img"
          // src={require("../../assets/Badges/jQueryBadge.png")}
          src={JBadge}
          alt=""
        />
        <img className="badge-img" src={CBadge} alt="" />
      </div>
    </section>
  );
}

export default Badges;
