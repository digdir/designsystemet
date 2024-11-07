import { RovingFocusRoot } from '@digdir/designsystemet-react';
import type { ColorInfo, ThemeColors } from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';

import type { modeType } from '../../types';
import { Group } from '../Group/Group';

import classes from './Scale.module.css';

type ScaleProps = {
  colorScale: ColorInfo[];
  showHeader?: boolean;
  showColorMeta?: boolean;
  themeMode: modeType;
  type: ThemeColors;
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
      hex: 'red',
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
            names={['Default', 'Subtle']}
            type={type}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colors={[colors[2], colors[3], colors[4]]}
            showColorMeta={showColorMeta}
            names={['Default', 'Hover', 'Active']}
            type={type}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colors={[colors[5], colors[6], colors[7]]}
            names={['Subtle', 'Default', 'Strong']}
            type={type}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Base' : ''}
            colors={[colors[8], colors[9], colors[10]]}
            names={['Default', 'Hover', 'Active']}
            type={type}
            featured
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colors={[colors[11], colors[12]]}
            names={['Subtle', 'Default']}
            type={type}
          />
        </div>
      </RovingFocusRoot>
    </div>
  );
};
