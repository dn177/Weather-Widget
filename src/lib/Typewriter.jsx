import React, { useEffect, useState } from "react";
import useInView from "../hooks/useInView";

// Delay holding the finished sentence on screen before an `infinite`
// typewriter wipes and restarts.
const HOLD_DELAY = 2500;

// jsdom lacks matchMedia unless the test setup stubs it (src/test/setup.js),
// so keep the lookup defensive.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Typewriter = ({ className, text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  // Read once per mount: flipping the OS setting mid-session is rare enough
  // that a reload is acceptable.
  const [reduceMotion] = useState(prefersReducedMotion);
  // Track visibility both ways so the timer loop pauses off-screen instead
  // of ticking for the whole session.
  const [wrapperRef, inView] = useInView("0px", { once: false });

  useEffect(() => {
    // Reduced motion renders the full sentence below with no ticking;
    // off-screen the loop simply pauses until scrolled back into view.
    if (reduceMotion || !inView) return undefined;

    let timeout;

    // Strictly less than: at currentIndex === text.length the text is
    // complete; appending text[length] would stringify `undefined`.
    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      // Hold the completed sentence for a beat before the loop restarts.
      timeout = setTimeout(() => {
        setCurrentIndex(0);
        setCurrentText("");
      }, HOLD_DELAY);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text, inView, reduceMotion]);

  // The animated span churns letter-by-letter, so hide it from screen
  // readers; they get one stable sentence from the wrapper's aria-label.
  return (
    <span ref={wrapperRef} className={className} aria-label={text}>
      <span aria-hidden="true">{reduceMotion ? text : currentText}</span>
    </span>
  );
};

export default Typewriter;
