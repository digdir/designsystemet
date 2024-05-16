import { useEffect, useRef } from 'react';

// This hook corresponds to the componentDidUpdate function in class components.
// It is similar to useEffect, but does not run on the first render.
export const useUpdate: typeof useEffect = (effect, deps) => {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      return effect();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
