import { RovingFocusRoot } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import { Group } from '../Group/Group';

import classes from './Scale.module.css';

type ScaleProps = {
  colorScale: ThemeInfo;
  showHeader?: boolean;
  showColorMeta?: boolean;
  namespace: string;
};

export const Scale = ({
  colorScale,
  showHeader,
  showColorMeta,
  namespace,
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
            namespace={namespace}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colors={[2, 3, 4]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Hover', 'Active']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colors={[5, 6, 7]}
            colorScale={colorScale}
            names={['Subtle', 'Default', 'Strong']}
            namespace={namespace}
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
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colors={[11, 12]}
            colorScale={colorScale}
            names={['Subtle', 'Default']}
            namespace={namespace}
          />
        </div>
      </RovingFocusRoot>
    </div>
  );
};
