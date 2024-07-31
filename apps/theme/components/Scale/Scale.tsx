import { RovingFocusRoot } from '@digdir/designsystemet-react';
import type { ColorInfo, ColorType } from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';

import type { modeType } from '../../types';
import { Group } from '../Group/Group';

import classes from './Scale.module.css';

type ScaleProps = {
  colorScale: ColorInfo[];
  showHeader?: boolean;
  showColorMeta?: boolean;
  themeMode: modeType;
  type: ColorType;
};

const setTokens = (lightColors: ColorInfo[], type: string) => {
  const previewElement = document.getElementById('preview');
  if (previewElement) {
    for (let i = 0; i < lightColors.length; i++) {
      previewElement.style.setProperty(
        '--' + type + '-' + (i + 1),
        lightColors[i].hex,
      );
    }
  }
};

const generateDefaultColors = () => {
  const arr: ColorInfo[] = [];

  for (let i = 0; i < 14; i++) {
    arr.push({
      hex: '#ffffff',
      number: 1,
      name: 'Default',
    });
  }

  return arr;
};

export const Scale = ({
  colorScale,
  showHeader,
  showColorMeta,
  themeMode,
  type,
}: ScaleProps) => {
  const [colors, setColors] = useState<ColorInfo[]>(generateDefaultColors());

  useEffect(() => {
    if (colorScale.length > 0) {
      setColors(colorScale);
    }
    setTokens(colorScale, type);
  }, [colorScale, themeMode, type]);
  return (
    <div className={classes.themes}>
      <RovingFocusRoot asChild>
        <div className={classes.test}>
          <Group
            header={showHeader ? 'Background' : ''}
            colors={[colors[0], colors[1]]}
            showColorMeta={showColorMeta}
            names={['1. Default', '2. Subtle']}
            type={type}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colors={[colors[2], colors[3], colors[4]]}
            showColorMeta={showColorMeta}
            names={['3. Default', '4. Hover', '5. Active']}
            type={type}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colors={[colors[5], colors[6], colors[7]]}
            names={['6. Subtle', '7. Default', '8. Strong']}
            type={type}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Base' : ''}
            colors={[colors[8], colors[9], colors[10]]}
            names={['9. Default', '10. Hover', '11. Active']}
            type={type}
            featured
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colors={[colors[11], colors[12]]}
            names={['12. Subtle', '13. Default']}
            type={type}
          />
        </div>
      </RovingFocusRoot>
    </div>
  );
};
