import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, inView].
 *
 * With `once` (the default) `inView` flips to true once the referenced
 * element approaches the viewport and stays true — intended for mount-once
 * lazy-loading of heavy below-the-fold sections.
 *
 * With `once: false` it tracks visibility both ways, so callers can pause
 * work (timers, loops) while the element is scrolled off-screen.
 */
export const useInView = (rootMargin = "600px", { once = true } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if ((once && inView) || !ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin, once]);

  return [ref, inView];
};

export default useInView;
