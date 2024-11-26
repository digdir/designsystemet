import cl from 'clsx/lite';
import { useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './BorderRadiusInput.module.css';

export const BorderRadiusInput = () => {
  const [active, setActive] = useState(0);
  const setBorderRadius = useThemeStore((state) => state.setBorderRadius);
  const borderRadius = useThemeStore((state) => state.borderRadius);
  const items = [
    { name: 'Ingen', type: 'none', value: '0px' },
    { name: 'Small', type: 'small', value: '6px' },
    { name: 'Medium', type: 'medium', value: '10px' },
    { name: 'Large', type: 'large', value: '13px' },
    { name: 'Full', type: 'full', value: '9999px' },
  ];

  return (
    <div>
      <div className={classes.items}>
        {items.map((item, index) => (
          <div
            className={cl(
              classes.item,
              borderRadius === item.type && classes.active,
            )}
            key={index}
            onClick={() => setActive(index)}
          >
            <div
              className={cl(classes.box)}
              onClick={() => {
                setBorderRadius(
                  item.type as 'none' | 'small' | 'medium' | 'large' | 'full',
                );
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
