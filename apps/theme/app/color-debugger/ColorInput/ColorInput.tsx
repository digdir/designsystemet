import cl from 'clsx/lite';
import { ColorPicker, ColorService, type IColor } from 'react-color-palette';
import classes from './ColorInput.module.css';

type ColorInputProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  showPicker: boolean;
  onColorClicked: () => void;
};

export const ColorInput = ({
  color,
  setColor,
  showPicker,
  onColorClicked,
}: ColorInputProps) => {
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
      <button
        className={classes.colorBtn}
        style={{ backgroundColor: color.hex }}
        onClick={() => onColorClicked()}
      ></button>
      <div className={cl(classes.picker, !showPicker && classes.hidePicker)}>
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
