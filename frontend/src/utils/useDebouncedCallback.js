import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback(fn, delay) {
  const fnRef = useRef(fn);
  const timerRef = useRef(null);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay]
  );
}
