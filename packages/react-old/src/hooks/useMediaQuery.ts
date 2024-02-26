import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean =>
    window?.matchMedia(query).matches ?? false;

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  const eventListener = () => {
    setMatches(getMatches(query));
  };

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    eventListener();
    matchMedia.addEventListener('change', eventListener);
    return () => matchMedia.removeEventListener('change', eventListener);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return matches;
}
