import { useEffect, useState } from 'react';
import classes from './token-size.module.css';

interface TokenFontSizeProps {
  value: string;
}

const TokenSize = ({ value }: TokenFontSizeProps) => {
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
    <div className={classes.size}>
      <div className={classes.bar} style={{ width: computedValue }}></div>
    </div>
  );
};

export { TokenSize };
