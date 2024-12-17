import { Button, Heading, Textfield } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';
import { type BaseBorderRadius, useThemeStore } from '../../store';
import classes from './BorderRadiusInput.module.css';

export const BorderRadiusInput = () => {
  const [active, setActive] = useState(0);
  const setBorderRadius = useThemeStore((state) => state.setBaseBorderRadius);
  const borderRadius = useThemeStore((state) => state.baseBorderRadius);
  const items: { name: string; value: BaseBorderRadius }[] = [
    { name: 'Ingen', value: 0 },
    { name: 'Small', value: 4 },
    { name: 'Medium', value: 8 },
    { name: 'Large', value: 12 },
    { name: 'Full', value: 9999 },
  ];

  return (
    <div>
      <Heading className={classes.heading} data-size='xs'>
        Foreslått Border radius
      </Heading>
      <div className={classes.items}>
        {items.map((item, index) => (
          <div
            className={cl(
              classes.item,
              borderRadius === item.value && classes.active,
            )}
            key={index}
            onClick={() => setActive(index)}
          >
            <Button
              variant='tertiary'
              data-color='neutral'
              className={cl(classes.box)}
              onClick={() => {
                setBorderRadius(item.value);
              }}
            >
              <div className={classes.text}>{item.name}</div>
              <div
                className={classes.inner}
                style={{ borderRadius: item.value }}
              ></div>
            </Button>
          </div>
        ))}
      </div>
      <Heading className={classes.heading} data-size='xs'>
        Manuell Border radius
      </Heading>
      <Textfield
        label='Definer baseverdien for border-radius'
        value={borderRadius}
        onChange={(e) => {
          const updatedValue = parseInt(e.target.value);
          if (updatedValue >= 0) {
            setBorderRadius(updatedValue);
          } else {
            setBorderRadius(0);
          }
        }}
      ></Textfield>
    </div>
  );
};
