import type { ThemeInfo } from '@digdir/designsystemet/color';
import { RovingFocusRoot } from '@digdir/designsystemet-react';
import { ColorGroup } from '../color-group/color-group';

import classes from './scale.module.css';

type ScaleProps = {
  colorScale: ThemeInfo;
  showHeader?: boolean;
  namespace: string;
};

export const Scale = ({ colorScale, showHeader, namespace }: ScaleProps) => {
  return (
    <div className={classes.themes}>
      <RovingFocusRoot activeValue={namespace + '1'} asChild>
        <div className={classes.test}>
          <ColorGroup
            header={showHeader ? 'Background' : ''}
            colorNames={['background-default', 'background-tinted']}
            colorScale={colorScale}
            names={['Default', 'Tinted']}
            namespace={namespace}
          />
          <ColorGroup
            header={showHeader ? 'Surface' : ''}
            colorNames={[
              'surface-default',
              'surface-tinted',
              'surface-hover',
              'surface-active',
            ]}
            colorScale={colorScale}
            names={['Default', 'Tinted', 'Hover', 'Active']}
            namespace={namespace}
          />
          <ColorGroup
            header={showHeader ? 'Border' : ''}
            colorNames={['border-subtle', 'border-default', 'border-strong']}
            colorScale={colorScale}
            names={['Subtle', 'Default', 'Strong']}
            namespace={namespace}
          />
          <ColorGroup
            header={showHeader ? 'Text' : ''}
            colorNames={['text-subtle', 'text-default']}
            colorScale={colorScale}
            names={['Subtle', 'Default']}
            namespace={namespace}
          />
          <ColorGroup
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
