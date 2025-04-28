import { Button, Input } from '@digdir/designsystemet-react';
import { ArrowsCirclepathIcon, MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import classes from './LightnessInput.module.css';

type LightnessInputProps = {
  label: string;
  handleReset: () => void;
  initialValue?: number;
  value?: number;
};

export const LightnessInput = ({
  label,
  handleReset,
  initialValue,
  value,
}: LightnessInputProps) => {
  return (
    <div>
      <div className={classes.labelContainer}>
        <div className={classes.label}>{label}</div>
      </div>
      <div data-size='sm' className={classes.inputRow}>
        <div className={classes.inputContainer}>
          <Input
            data-size='sm'
            defaultValue={initialValue}
            className={cl(
              classes.input,
              classes.activeInput && value === initialValue,
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
