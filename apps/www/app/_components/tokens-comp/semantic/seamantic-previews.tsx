import { useEffect, useState } from 'react';
import classes from './semantic.module.css';

const getComputedValue = (value: string) => {
  const elm = document.createElement('div');
  elm.style.cssText = `width: ${value}; height: ${value};`;
  document.body.appendChild(elm);
  const computedValue = getComputedStyle(elm).width;
  document.body.removeChild(elm);

  return computedValue;
};

export const Size = ({ value }: { value: string }) => {
  // This is a temp solution to get the computed value of the token. Find a better way to do this in https://github.com/digdir/designsystemet/issues/2946
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    setComputedValue(getComputedValue(value));
  }, [value]);

  return (
    <div className={classes.size}>
      <div className={classes.bar} style={{ width: computedValue }}></div>
    </div>
  );
};

export const Shadow = ({ value }: { value: string }) => {
  return (
    <div className={classes.shadow}>
      <div style={{ boxShadow: value }} className={classes.color}></div>
    </div>
  );
};

export const BorderRadius = ({ value }: { value: string }) => {
  return (
    <div className={classes.radius}>
      <div className={classes.bar} style={{ borderRadius: value }}></div>
    </div>
  );
};

export const Opacity = ({ value }: { value: string }) => {
  return <div style={{ opacity: value }} lang='en'>opacity</div>;
};

export const ComputedValue = ({ value }: { value: string }) => {
  // This is a temp solution to get the computed value of the token. Find a better way to do this in https://github.com/digdir/designsystemet/issues/2946
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    setComputedValue(getComputedValue(value));
  }, [value]);

  return <code>{computedValue}</code>;
};
