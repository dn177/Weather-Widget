import React from "react";
import "./card.css";

const Card = ({ children, className, onClick, style }) => {
  return (
    <article className={`card ${className}`} onClick={onClick} style={style}>
      {children}
    </article>
  );
};

export default Card;
