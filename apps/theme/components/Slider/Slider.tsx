import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import classes from './Slider.module.css';

type SliderProps = {
  label: string;
  min: number;
  max: number;
  initialValue: number;
  onChange?: (value: number) => void;
  onReset?: (initialValue: number) => void;
};

export const Slider = ({
  label,
  min,
  max,
  initialValue,
  onChange,
  onReset,
}: SliderProps) => {
  const [sliderValue, setSliderValue] = useState(initialValue);

  const handleChange = (value: number) => {
    setSliderValue(value);
    if (onChange) {
      onChange(value);
    }
  };
  const handleReset = () => {
    setSliderValue(initialValue);
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
            value={sliderValue}
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
              sliderValue !== initialValue ? classes.activeInput : '',
            )}
            data-size='sm'
            type='text'
            value={sliderValue}
            readOnly
          />
          <button
            className={cl(
              classes.resetBtn,
              sliderValue === initialValue ? classes.hidden : '',
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
