import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, inView]. `inView` flips to true once the referenced element
 * approaches the viewport (and stays true — intended for mount-once
 * lazy-loading of heavy below-the-fold sections).
 */
export const useInView = (rootMargin = "600px") => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView || !ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
};

export default useInView;
