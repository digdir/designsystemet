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
            {type === 'radius' && (
              <div
                className={classes.inner}
                style={{ borderRadius: item.value }}
              ></div>
            )}
            {type === 'appearance' && (
              <div className={classes.appearance}>
                <div className={cl(classes.icon, classes[item.value])}></div>
                {item.name}
              </div>
            )}
          </div>
          {showLabel && <div className={classes.text}>{item.name}</div>}
        </div>
      ))}
    </div>
  );
};
