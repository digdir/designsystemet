'use client';
import { useState } from 'react';

import { ToggleGroup } from '@digdir/designsystemet-react';
import { OverviewComponents } from '../OverviewComponents/OverviewComponents';
import classes from './Previews.module.css';

export const Previews = () => {
  const [theme, setTheme] = useState<'blue' | 'purple'>('blue');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');

  return (
    <>
      <div className={classes.toolbar} data-size='sm'>
        <ToggleGroup
          value={theme}
          onChange={(v) => setTheme(v as 'blue' | 'purple')}
        >
          <ToggleGroup.Item value='blue'>Blå</ToggleGroup.Item>
          <ToggleGroup.Item value='purple'>Lilla</ToggleGroup.Item>
        </ToggleGroup>
        <ToggleGroup
          value={appearance}
          onChange={(v) => setAppearance(v as 'light' | 'dark')}
        >
          <ToggleGroup.Item value='light'>Lys</ToggleGroup.Item>
          <ToggleGroup.Item value='dark'>Mørk</ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <div
        className={classes.preview}
        data-color-scheme={appearance}
        data-theme={theme}
      >
        <OverviewComponents />
      </div>
    </>
  );
};
