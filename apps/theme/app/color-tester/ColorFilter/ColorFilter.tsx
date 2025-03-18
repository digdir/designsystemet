import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { ColorScaleNames } from '../utils';
import classes from './ColorFIlter.module.css';

type ColorFilterProps = {
  onFilterChange: (name: string) => void;
};

export const ColorFilter = ({ onFilterChange }: ColorFilterProps) => {
  const [selected, setSelected] = useState<NameType>(
    Object.keys(ColorScaleNames)[0] as NameType,
  );

  useEffect(() => {
    setSelected(Object.keys(ColorScaleNames)[0] as NameType);
  }, []);

  type ItemProps = {
    name: string;
    active?: boolean;
  };

  type NameType = keyof typeof ColorScaleNames;

  const Item = ({ name, active }: ItemProps) => {
    return (
      <button
        key={name}
        className={cl(classes.item, active && classes.active)}
        onClick={() => {
          setSelected(name as NameType);
          onFilterChange(name);
        }}
      >
        {name}
      </button>
    );
  };

  return (
    <div className={classes.filter}>
      <div>
        {ColorScaleNames.map((name, index) => (
          <Item name={name} key={index} active={selected === name} />
        ))}
      </div>
    </div>
  );
};
