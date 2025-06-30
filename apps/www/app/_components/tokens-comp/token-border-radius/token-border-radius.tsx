import { useEffect, useState } from 'react';
import classes from './token-border-radius.module.css';

const TokenBorderRadius = ({ value }: { value: string }) => {
  // This is a temp solution to get the computed value of the token. Find a better way to do this in https://github.com/digdir/designsystemet/issues/2946
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    const elm = document.createElement('div');
    elm.style.cssText = `width: ${value}; height: ${value};`;
    document.body.appendChild(elm);
    const computedValue = getComputedStyle(elm).width;
    document.body.removeChild(elm);

    setComputedValue(computedValue);
  }, [value]);

  return (
    <div className={classes.radius}>
      <code>{computedValue}</code>
      <div className={classes.bar} style={{ borderRadius: value }}></div>
    </div>
  );
};

export { TokenBorderRadius };
