/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useEffect, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import type { modeType } from '@/types';

import { Group } from '../Group/Group';

import classes from './Scale.module.css';

type ScaleProps = {
  colorScale: CssColor[];
  showHeader?: boolean;
  showColorMeta?: boolean;
  themeMode: modeType;
  type: 'accent' | 'grey' | 'brandOne' | 'brandTwo' | 'brandThree';
};

const setTokens = (lightColors: CssColor[], type: string) => {
  const previewElement = document.getElementById('preview');
  if (previewElement) {
    for (let i = 0; i < lightColors.length; i++) {
      previewElement.style.setProperty('--' + type + (i + 1), lightColors[i]);
    }
  }
};

export const Scale = ({
  colorScale,
  showHeader,
  showColorMeta,
  themeMode,
  type,
}: ScaleProps) => {
  // Is there a way to not have to set this default value?
  const [colors, setColors] = useState<CssColor[]>([]);

  useEffect(() => {
    setColors(colorScale);
    setTokens(colorScale, type);
  }, [colorScale, themeMode, type]);
  return (
    <div className={classes.themes}>
      <div className={classes.test}>
        <Group
          header={showHeader ? 'Background' : ''}
          colors={[colors[0], colors[1]]}
          showColorMeta={showColorMeta}
          names={['1. Default', '2. Subtle']}
        />
        <Group
          header={showHeader ? 'Surface' : ''}
          colors={[colors[2], colors[3], colors[4]]}
          showColorMeta={showColorMeta}
          names={['3. Default', '4. Hover', '5. Active']}
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? 'Border' : ''}
          colors={[colors[5], colors[6], colors[7]]}
          names={['6. Subtle', '7. Default', '8. Strong']}
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? 'Base' : ''}
          colors={[colors[8], colors[9], colors[10]]}
          names={['9. Default', '10. Hover', '11. Active']}
          featured
        />
        <Group
          showColorMeta={showColorMeta}
          header={showHeader ? 'Text' : ''}
          colors={[colors[11], colors[12]]}
          names={['12. Subtle', '13. Default']}
        />
      </div>
    </div>
  );
};
