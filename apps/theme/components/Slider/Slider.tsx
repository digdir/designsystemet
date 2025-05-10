import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import classes from './Slider.module.css';

type SliderProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  initialValue: number;
  onChange?: (value: number) => void;
  onReset?: (value: number) => void;
};

export const Slider = ({
  label,
  min,
  max,
  value,
  initialValue,
  onChange,
  onReset,
}: SliderProps) => {
  const handleChange = (value: string | number) => {
    if (onChange) {
      const parsedValue = value === '-' ? '-' : Number(value);
      if (!Number.isNaN(parsedValue) || value === '-') {
        onChange(parsedValue as number);
      }
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset(initialValue);
    }
  };

  return (
    <div>
      <div className={classes.labelContainer}>
        <div className={classes.label}>{label}</div>
      </div>
      <div className={classes.sliderContainer}>
        <div className={classes.slider}>
          <input
            className={classes.range}
            type='range'
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
          <div className={classes.rangeLabels}>
            <div>{min}%</div>
            <div>0%</div>
            <div>+{max}%</div>
          </div>
        </div>

        <div className={classes.inputContainer}>
          <input
            className={cl(
              classes.valueInput,
              value !== initialValue ? classes.activeInput : '',
            )}
            data-size='sm'
            type='text'
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
          <button
            className={cl(
              classes.resetBtn,
              value === initialValue ? classes.hidden : '',
            )}
            onClick={handleReset}
          >
            <ArrowsCirclepathIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
