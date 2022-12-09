import { useEffect } from 'react';

export function useEventListener(eventType: string, action: () => void) {
  useEffect(() => {
    document.addEventListener(eventType, action);
    return () => document.removeEventListener(eventType, action);
  }, [eventType, action]);
}
