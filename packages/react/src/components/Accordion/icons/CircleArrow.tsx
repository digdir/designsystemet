import React, { SVGProps } from 'react';
import { tokens } from '../../../DesignTokens';

export const CircleArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 36 36'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='
        M 18   34
        C 26.8 34    34   26.8 34 18
        C 34    9.2  26.8  2   18  2
        C  9.2  2     2    9.2  2 18
        C  2   26.8   9.2 34   18 34
        Z
        M 14.3556 11.1556
        L 16.0444 9.37778
        L 24.2222 17.5556
        L 16.0444 25.7333
        L 14.3556 23.9556
        L 20.8444 17.5556
        L 14.3556 11.1556
        Z
      '
      fill={tokens.ColorsBlue700}
    />
  </svg>
);