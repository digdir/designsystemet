import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Fieldset, type Size, ToggleGroup } from '@digdir/designsystemet-react';
import { Showcase } from '@internal/components';

import classes from './showcase.module.css';

export default {
  title: 'Showcase',
  parameters: {
    chromatic: {
      modes: {
        mobile: {
          disable: true,
        },
      },
    },
    a11y: {
      // TODO: this rule should be enabled after https://github.com/dequelabs/axe-core/issues/4672 have propagated to @storybook/addon-a11y.
      config: {
        rules: [
          {
            id: 'aria-allowed-role',
            enabled: false,
          },
        ],
      },
    },
  },
} as Meta;

const sizes: Size[] = ['sm', 'md', 'lg'];
const colorModes = ['light', 'dark', 'auto'];
const typography = ['primary', 'secondary'];

export const ShowcaseStory: StoryFn = () => {
  const [size, setSize] = useState<Size>('sm');
  const [colorMode, setColorMode] = useState('auto');
  const [typographyMode, setTypographyMode] = useState('primary');

  return (
    <div className={classes.wrapper}>
      <div className={classes.controls} data-size='sm'>
        <Fieldset>
          <Fieldset.Legend>
            Størrelse
            <code data-size='xs'>(data-size)</code>
          </Fieldset.Legend>
          <ToggleGroup value={size} onChange={(val) => setSize(val as Size)}>
            {sizes.map((size) => (
              <ToggleGroup.Item key={size} value={size}>
                {size}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>
            Fargemodus
            <code data-size='xs'>(data-color-scheme)</code>
          </Fieldset.Legend>
          <ToggleGroup value={colorMode} onChange={setColorMode}>
            {colorModes.map((colorMode) => (
              <ToggleGroup.Item key={colorMode} value={colorMode}>
                {colorMode}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>
            Typografi
            <code data-size='xs'>(data-typography)</code>
          </Fieldset.Legend>
          <ToggleGroup value={typographyMode} onChange={setTypographyMode}>
            {typography.map((typographyMode) => (
              <ToggleGroup.Item key={typographyMode} value={typographyMode}>
                {typographyMode}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
      </div>
      <Showcase
        data-size={size}
        data-color-scheme={colorMode}
        data-typography={typographyMode}
      />
    </div>
  );
};
