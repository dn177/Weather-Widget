import React, { useState, useEffect } from "react";

const Typewriter = ({ className, text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    // Strictly less than: at currentIndex === text.length the text is
    // complete — appending text[length] would stringify `undefined`.
    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      setCurrentIndex(0);
      setCurrentText("");
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text]);

  return <span className={className}>{currentText}</span>;
};

export default Typewriter;
