import { Button, Input } from '@digdir/designsystemet-react';
import { ArrowsCirclepathIcon, MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import classes from './LightnessInput.module.css';

type LightnessInputProps = {
  label: string;
  description?: string;
  initialValue: number;
  oneLiner?: boolean;
  onChange?: (value: number) => void;
  onReset?: (value: number) => void;
  value: number;
};

export const LightnessInput = ({
  label,
  description,
  onChange,
  onReset,
  initialValue,
  oneLiner = false,
  value,
}: LightnessInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const isActiveRef = useRef(currentValue !== initialValue);

  useEffect(() => {
    setCurrentValue(value);
    isActiveRef.current = value !== initialValue;
  }, [value, initialValue]);

  const handleChange = (v: number) => {
    if (v !== currentValue && v >= 0 && v <= 100) {
      setCurrentValue(v);
      isActiveRef.current = v !== initialValue;
      onChange?.(v);
    }
  };

  const handleReset = () => {
    if (currentValue !== initialValue) {
      setCurrentValue(initialValue);
      isActiveRef.current = false;
      onReset?.(initialValue);
    }
  };

  return (
    <div className={cl(classes.container, oneLiner && classes.oneLiner)}>
      <div
        className={cl(
          classes.labelContainer,
          oneLiner && classes.labelContainerOneLiner,
        )}
      >
        <div className={classes.label}>{label}</div>
        {description && (
          <div
            className={cl(
              classes.description,
              oneLiner && classes.oneLinerDescription,
            )}
          >
            {description}
          </div>
        )}
      </div>
      <div data-size='sm' className={classes.inputRow}>
        <div className={classes.inputContainer}>
          <Input
            data-size='sm'
            value={currentValue}
            onChange={(e) => handleChange(Number(e.target.value))}
            className={cl(
              classes.input,
              isActiveRef.current && classes.activeInput,
            )}
          />
          <button
            className={cl(
              classes.resetBtn,
              !isActiveRef.current && classes.hidden,
            )}
            onClick={handleReset}
          >
            <ArrowsCirclepathIcon />
          </button>
        </div>

        <Button
          variant='tertiary'
          data-color='neutral'
          className={classes.minusBtn}
          onClick={() => {
            handleChange(currentValue - 1);
          }}
        >
          <MinusIcon title='a11y-title' fontSize='1.5rem' />
        </Button>
        <Button
          variant='tertiary'
          data-color='neutral'
          className={classes.plusBtn}
          onClick={() => {
            handleChange(currentValue + 1);
          }}
        >
          <PlusIcon title='a11y-title' fontSize='1.5rem' />
        </Button>
      </div>
    </div>
  );
};
