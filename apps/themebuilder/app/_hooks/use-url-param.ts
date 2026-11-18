import { type NavigateOptions, useSearchParams } from 'react-router';

/**
 * One parameter in the URL, for view state such as the tab and the appearance.
 * The value is set on the URL as it is when the setter is called, not as it was in the last render,
 * so that two parameters set right after each other do not undo one another.
 */
export const useUrlParam = (
  name: string,
  options?: NavigateOptions,
): [string | null, (value: string) => void] => {
  const [params, setParams] = useSearchParams();

  const setParam = (value: string) => {
    const next = new URLSearchParams(window.location.search);
    next.set(name, value);
    setParams(next, { replace: true, ...options });
  };

  return [params.get(name), setParam];
};
