import type { SVGProps } from 'react';
import React from 'react';
import * as tokens from '@altinn/figma-design-tokens';

export const Arrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 36 36'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='
        M 12.8834 34
        L 10      31.0909
        L 22.9754 18
        L 10       4.90909
        L 12.8834  2
        L 28.7423 18
        L 12.8834 34
        Z
      '
      fill={tokens.ColorsBlack}
    />
  </svg>
);
