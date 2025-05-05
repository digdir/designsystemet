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
            colorNames={['background-default', 'background-tinted']}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Tinted']}
            namespace={namespace}
          />
          <Group
            header={showHeader ? 'Surface' : ''}
            colorNames={[
              'surface-default',
              'surface-tinted',
              'surface-hover',
              'surface-active',
            ]}
            colorScale={colorScale}
            showColorMeta={showColorMeta}
            names={['Default', 'Tinted', 'Hover', 'Active']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Border' : ''}
            colorNames={['border-subtle', 'border-default', 'border-strong']}
            colorScale={colorScale}
            names={['Subtle', 'Default', 'Strong']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Text' : ''}
            colorNames={['text-subtle', 'text-default']}
            colorScale={colorScale}
            names={['Subtle', 'Default']}
            namespace={namespace}
          />
          <Group
            showColorMeta={showColorMeta}
            header={showHeader ? 'Base' : ''}
            colorNames={[
              'base-default',
              'base-hover',
              'base-active',
              'base-contrast-subtle',
              'base-contrast-default',
            ]}
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
