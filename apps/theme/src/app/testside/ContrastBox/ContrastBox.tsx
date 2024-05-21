/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import cn from 'classnames';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import { getContrastFromHex } from '@/utils/ColorUtils';

import classes from './ContrastBox.module.css';

export const ContrastBox = (mainColor: CssColor, bgColor: CssColor) => {
  const contrast = getContrastFromHex(mainColor, bgColor);
  return (
    <div className={classes.contrast}>
      {contrast > 4.5 && <div className={cn(classes.dot, classes.green)}></div>}
      {contrast < 4.5 && contrast > 3 && (
        <div className={cn(classes.dot, classes.orange)}></div>
      )}
      {contrast < 3 && <div className={cn(classes.dot, classes.red)}></div>}
      <div>{contrast.toFixed(1)}:1</div>
    </div>
  );
};
