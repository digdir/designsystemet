// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect

import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
