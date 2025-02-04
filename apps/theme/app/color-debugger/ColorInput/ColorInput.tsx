import { ArrowsCirclepathIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { ColorPicker, ColorService, type IColor } from 'react-color-palette';
import classes from './ColorInput.module.css';

type ColorInputProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  showPicker: boolean;
  onColorClicked: () => void;
  showReset?: boolean;
  position?: 'top' | 'bottom';
};

export const ColorInput = ({
  color,
  setColor,
  showPicker,
  onColorClicked,
  showReset = false,
  position = 'bottom',
}: ColorInputProps) => {
  const [initialColor, setInitialColor] = useState(color);
  useEffect(() => {
    setInitialColor(color);
  }, []);

  return (
    <div className={classes.item}>
      <input
        type='text'
        className={classes.input}
        value={color.hex}
        onChange={(e) => {
          setColor(ColorService.convert('hex', e.target.value));
        }}
      />
      {showReset && initialColor.hex !== color.hex && (
        <button
          className={classes.loopBtn}
          onClick={() => setColor(initialColor)}
        >
          <ArrowsCirclepathIcon title='a11y-title' fontSize='1.5rem' />
        </button>
      )}
      {!showPicker && (
        <button
          className={classes.colorBtn}
          style={{ backgroundColor: color.hex }}
          onClick={() => onColorClicked()}
        ></button>
      )}
      {showPicker && (
        <button className={classes.closeBtn} onClick={() => onColorClicked()}>
          <XMarkIcon title='a11y-title' fontSize='1.6rem' />
        </button>
      )}
      <div
        className={cl(
          classes.picker,
          !showPicker && classes.hidePicker,
          position === 'top' && classes.top,
        )}
      >
        <ColorPicker
          hideAlpha
          color={color}
          onChange={setColor}
          hideInput={['rgb', 'hsv']}
        />
      </div>
    </div>
  );
};
