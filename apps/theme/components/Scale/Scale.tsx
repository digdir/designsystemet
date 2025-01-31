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
      <RovingFocusRoot activeValue={namespace + '1'} asChild>
        <div className={classes.test}>
          <Group
            header={showHeader ? 'Background' : ''}
            colors={[0, 1]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Tinted']}
            namespace={namespace}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colors={[2, 3, 4, 5]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Tinted', 'Hover', 'Active']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colors={[6, 7, 8]}
            colorScale={colorScale}
            names={['Subtle', 'Default', 'Strong']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colors={[9, 10]}
            colorScale={colorScale}
            names={['Subtle', 'Default']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Base' : ''}
            colors={[11, 12, 13, 14, 15]}
            colorScale={colorScale}
            names={[
              'Default',
              'Hover',
              'Active',
              'Contrast Subtle',
              'Contrast Default',
            ]}
            namespace={namespace}
          />
        </div>
      </RovingFocusRoot>
    </div>
  );
};
