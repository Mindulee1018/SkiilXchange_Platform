import { useState, useEffect } from 'react';

const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: options.threshold || 0.5 } // default threshold of 50% visibility
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold]);

  return { ref, inView };
};

export default useInView;
