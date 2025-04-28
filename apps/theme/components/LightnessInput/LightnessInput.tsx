import { Button, Input } from '@digdir/designsystemet-react';
import { ArrowsCirclepathIcon, MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import classes from './LightnessInput.module.css';

type LightnessInputProps = {
  label: string;
  handleReset: () => void;
  initialValue?: number;
  value?: number;
  oneLiner?: boolean;
};

export const LightnessInput = ({
  label,
  handleReset,
  initialValue,
  value,
  oneLiner = false,
}: LightnessInputProps) => {
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  return (
    <div className={cl(classes.container, oneLiner && classes.oneLiner)}>
      <div className={classes.labelContainer}>
        <div className={classes.label}>{label}</div>
      </div>
      <div data-size='sm' className={classes.inputRow}>
        <div className={classes.inputContainer}>
          <Input
            data-size='sm'
            value={currentValue}
            onChange={(e) => setCurrentValue(Number(e.target.value))}
            className={cl(
              classes.input,
              classes.activeInput && currentValue === initialValue,
            )}
          />
          <button className={classes.resetBtn} onClick={handleReset}>
            <ArrowsCirclepathIcon />
          </button>
        </div>

        <Button
          variant='tertiary'
          data-color='neutral'
          className={classes.minusBtn}
        >
          <MinusIcon title='a11y-title' fontSize='1.5rem' />
        </Button>
        <Button
          variant='tertiary'
          data-color='neutral'
          className={classes.plusBtn}
        >
          <PlusIcon title='a11y-title' fontSize='1.5rem' />
        </Button>
      </div>
    </div>
  );
};
