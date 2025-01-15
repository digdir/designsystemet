import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './AppearanceToggle.module.css';

type AppearanceToggleProps = {
  showLabel?: boolean;
};

const items: {
  name: string;
  value: 'light' | 'dark';
}[] = [
  { name: 'Lys', value: 'light' },
  { name: 'Mørk', value: 'dark' },
];

export const AppearanceToggle = ({
  showLabel = false,
}: AppearanceToggleProps) => {
  const appearance = useThemeStore((state) => state.appearance);
  const setAppearance = useThemeStore((state) => state.setAppearance);

  const [active, setActive] = useState(appearance);

  useEffect(() => {
    setActive(appearance);
  }, [appearance]);

  return (
    <div className={classes.toggle}>
      {items.map((item) => (
        <div
          className={cl(classes.item, item.value === active && classes.active)}
          key={item.value}
          onClick={() => setActive(item.value)}
        >
          <div
            className={cl(classes.box)}
            onClick={() => {
              setAppearance(item.value);
            }}
          >
            <div className={classes.appearance}>
              {item.value === 'light' && (
                <SunIcon title='a11y-title' fontSize='1.5rem' />
              )}
              {item.value === 'dark' && (
                <MoonIcon title='a11y-title' fontSize='1.5rem' />
              )}
              {item.name}
            </div>
          </div>
          {showLabel && <div className={classes.text}>{item.name}</div>}
        </div>
      ))}
    </div>
  );
};
