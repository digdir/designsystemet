import { useState } from 'react';

import { useEventListener } from './useEventListener';

export const useUsingKeyboard = () => {
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  useEventListener('keydown', () => {
    setUsingKeyboard(true);
  });
  useEventListener('mousedown', () => {
    setUsingKeyboard(false);
  });
  return usingKeyboard;
};
