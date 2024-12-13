'use client';

import cl from 'clsx/lite';
import { useThemeStore } from '../../store';

import { ToggleChip } from '../ToggleChip/ToggleChip';
import classes from './Previews.module.css';
import { Theme1 } from './Theme1/Theme1';

export const Previews = () => {
  const setTheme = useThemeStore((state) => state.setThemePreview);
  const setAppearance = useThemeStore((state) => state.setAppearance);
  const items = [
    {
      name: 'Tema 1 lys',
      value: 'one-light',
    },
    {
      name: 'Tema 1 mørk',
      value: 'one-dark',
    },
    {
      name: 'Tema 2 lys',
      value: 'two-light',
    },
    {
      name: 'Tema 2 mørk',
      value: 'two-dark',
    },
  ];

  return (
    <>
      <div className={classes.toolbar}>
        <ToggleChip
          items={items}
          onChange={(e) => {
            if (e.includes('one')) {
              setTheme('one');
            } else if (e.includes('two')) {
              setTheme('two');
            }

            if (e.includes('light')) {
              setAppearance('light');
            } else if (e.includes('dark')) {
              setAppearance('dark');
            }
          }}
        />
      </div>

      <div className={cl(classes.preview)} id='preview2'>
        <Theme1 />
      </div>
    </>
  );
};
