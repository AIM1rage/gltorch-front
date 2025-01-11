import { useCallback, useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = "0%" }: IntersectionObserverInit,
  forward: boolean = true,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = useRef(false);
  const callback = useCallback(
    (entries: IntersectionObserverEntry[]): void => {
      const [entry] = entries;
      setEntry(entry);

      if (forward && entry.isIntersecting) {
        frozen.current = true;
      }
    },
    [forward],
  );

  useEffect(() => {
    if (elementRef.current && !frozen.current) {
      const observer = new IntersectionObserver(callback, {
        threshold,
        root,
        rootMargin,
      });
      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
    return undefined;
  }, [elementRef, threshold, root, rootMargin, frozen, callback]);

  return entry;
}
