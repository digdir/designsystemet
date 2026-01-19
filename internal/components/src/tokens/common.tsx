import { useEffect, useState } from 'react';
import classes from './table.module.css';

const getComputedValue = (value: string, size?: string) => {
  const elm = document.createElement('div');
  if (size) {
    elm.setAttribute('data-size', size);
  }
  elm.style.cssText = `width: ${value}; height: ${value};`;
  document.body.appendChild(elm);
  const computedValue = getComputedStyle(elm).width;
  document.body.removeChild(elm);

  return computedValue;
};

const Size = ({ value, size }: { value: string; size?: string }) => {
  // This is a temp solution to get the computed value of the token. Find a better way to do this in https://github.com/digdir/designsystemet/issues/2946
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    setComputedValue(getComputedValue(value, size));
  }, [value, size]);

  return (
    <div className={classes.size}>
      <div className={classes.bar} style={{ width: computedValue }}></div>
    </div>
  );
};

const Shadow = ({ value }: { value: string }) => {
  return (
    <div className={classes.shadow}>
      <div style={{ boxShadow: value }} className={classes.color}></div>
    </div>
  );
};

const BorderRadius = ({ value }: { value: string }) => {
  return (
    <div className={classes.radius}>
      <div className={classes.bar} style={{ borderRadius: value }}></div>
    </div>
  );
};

const Opacity = ({ value }: { value: string }) => {
  return (
    <div style={{ opacity: value }} lang='en'>
      opacity
    </div>
  );
};

const BorderWidth = ({ value }: { value: string }) => {
  return (
    <div className={classes['border-width']}>
      <div className={classes.bar} style={{ borderWidth: value }}></div>
    </div>
  );
};

export const ComputedValue = ({
  value,
  size,
}: {
  value: string;
  size?: string;
}) => {
  // This is a temp solution to get the computed value of the token. Find a better way to do this in https://github.com/digdir/designsystemet/issues/2946
  const [computedValue, setComputedValue] = useState<string>('');

  useEffect(() => {
    if (!document) return;

    setComputedValue(getComputedValue(value, size));
  }, [value, size]);

  return <code>{computedValue}</code>;
};

export const getValuePreview = (
  variable: string,
  value: string,
  size?: string,
) => {
  if (/^--ds-size.*(\d+|unit)$/.test(variable)) {
    return <Size value={value} size={size} />;
  }
  if (/^--ds-border-radius(?!.*(scale|base)$)/.test(variable)) {
    return <BorderRadius value={value} />;
  }

  if (/^--ds-shadow/.test(variable)) {
    return <Shadow value={value} />;
  }

  if (/^--ds-opacity/.test(variable)) {
    return <Opacity value={value} />;
  }

  if (/^--ds-border-width/.test(variable)) {
    return <BorderWidth value={value} />;
  }

  return <code>{value}</code>;
};

export const getValueRender = (
  variable: string,
  value: string,
  size?: string,
) => {
  if (!/opacity|shadow|size-base|size-step/.test(variable)) {
    return <ComputedValue value={value} size={size} />;
  }

  return <code>{value}</code>;
};
