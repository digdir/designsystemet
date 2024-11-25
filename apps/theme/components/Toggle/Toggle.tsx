import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import classes from './Toggle.module.css';

type ToggleProps = {
  type: 'radius' | 'appearance';
  items: { name: string; type: string; value: string }[];
  showLabel?: boolean;
  onChange?: (value: string) => void;
};

export const Toggle = ({
  type,
  items,
  showLabel = false,
  onChange,
}: ToggleProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className={classes.toggle}>
      {items.map((item, index) => (
        <div
          className={cl(classes.item, index === active && classes.active)}
          key={index}
          onClick={() => setActive(index)}
        >
          <div
            className={cl(classes.box)}
            onClick={() => onChange?.(item.value)}
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
