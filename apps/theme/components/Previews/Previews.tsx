'use client';
import { useState } from 'react';

import { ToggleGroup } from '@digdir/designsystemet-react';
import { OverviewComponents } from '../OverviewComponents/OverviewComponents';
import classes from './Previews.module.css';

const themes = {
  blue: {
    name: 'Eksempel 1',
    value: 'blue',
  },
  purple: {
    name: 'Eksempel 2',
    value: 'purple',
  },
};

export const Previews = () => {
  const [theme, setTheme] = useState<keyof typeof themes>('blue');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');

  return (
    <>
      <div className={classes.toolbar} data-size='sm'>
        <ToggleGroup
          value={theme}
          onChange={(v) => setTheme(v as keyof typeof themes)}
        >
          <ToggleGroup.Item value='blue'>{themes.blue.name}</ToggleGroup.Item>
          <ToggleGroup.Item value='purple'>
            {themes.purple.name}
          </ToggleGroup.Item>
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
