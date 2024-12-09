import { RovingFocusRoot } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import type { modeType } from '../../types';
import { Group } from '../Group/Group';

import classes from './Scale.module.css';

type ScaleProps = {
  colorScale: ThemeInfo;
  showHeader?: boolean;
  showColorMeta?: boolean;
  themeMode: modeType;
};

export const Scale = ({
  colorScale,
  showHeader,
  showColorMeta,
  themeMode,
}: ScaleProps) => {
  return (
    <div className={classes.themes}>
      <RovingFocusRoot asChild>
        <div className={classes.test}>
          <Group
            header={showHeader ? 'Background' : ''}
            colors={[0, 1]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Subtle']}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colors={[2, 3, 4]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Hover', 'Active']}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colors={[5, 6, 7]}
            colorScale={colorScale}
            names={['Subtle', 'Default', 'Strong']}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Base' : ''}
            colors={[8, 9, 10, 13, 14]}
            colorScale={colorScale}
            names={[
              'Default',
              'Hover',
              'Active',
              'Contrast Default',
              'Contrast Subtle',
            ]}
            featured
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colors={[11, 12]}
            colorScale={colorScale}
            names={['Subtle', 'Default']}
          />
        </div>
      </RovingFocusRoot>
    </div>
  );
};
