import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import classes from './ToggleChip.module.css';

type ToggleChipProps = {
  onChange: (value: string) => void;
  items: { name: string; value: string }[];
  defaultValue?: string;
};

export const ToggleChip = ({
  onChange,
  items,
  defaultValue,
}: ToggleChipProps) => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(defaultValue || items[0].value);
  }, []);
  return (
    <div className={classes.toggle}>
      {items.map((item, index) => (
        <button
          key={index}
          className={cl(
            classes.menuItem,
            'ds-focus',
            selected === item.value && classes.menuItemActive,
          )}
          onClick={() => {
            setSelected(item.value);
            onChange(item.value);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
