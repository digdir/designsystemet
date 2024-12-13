import cl from 'clsx/lite';
import { useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const [active, setActive] = useState(0);
  const setBorderRadius = useThemeStore((state) => state.setBorderRadius);
  const items = [
    { name: 'Ingen', type: 'sm', value: '0px' },
    { name: 'Small', type: 'sm', value: '6px' },
    { name: 'Medium', type: 'sm', value: '10px' },
    { name: 'Large', type: 'sm', value: '13px' },
    { name: 'Full', type: 'sm', value: '9999px' },
  ];

  return (
    <div>
      <div className={classes.items}>
        {items.map((item, index) => (
          <div
            className={cl(classes.item, index === active && classes.active)}
            key={index}
            onClick={() => setActive(index)}
          >
            <div
              className={cl(classes.box)}
              onClick={() => {
                if (item.name === 'Ingen') {
                  setBorderRadius('none');
                } else {
                  setBorderRadius(
                    item.name.toLowerCase() as
                      | 'small'
                      | 'medium'
                      | 'large'
                      | 'full',
                  );
                }
              }}
            >
              <div className={classes.text}>{item.name}</div>
              <div
                className={classes.inner}
                style={{ borderRadius: item.value }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
