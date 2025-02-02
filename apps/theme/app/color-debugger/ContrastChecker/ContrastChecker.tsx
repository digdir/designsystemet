import {
  type CssColor,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import {
  ColorPicker,
  ColorService,
  type IColor,
  useColor,
} from 'react-color-palette';
import classes from './ContrastChecker.module.css';

type ColorInputProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  showPicker: boolean;
  onColorClicked: () => void;
};

const ColorInput = ({
  color,
  setColor,
  showPicker,
  onColorClicked,
}: ColorInputProps) => {
  return (
    <div className={classes.colorInput}>
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

export const ContrastChecker = () => {
  const [colorOne, setColorOne] = useColor('#0062BA');
  const [colorTwo, setColorTwo] = useColor('#FFFFFF');
  const [result, setResult] = useState('13.2:1');
  const [showPickerOne, setShowPickerOne] = useState(false);
  const [showPickerTwo, setShowPickerTwo] = useState(false);

  const setResults = () => {
    setResult(
      getContrastFromHex(
        colorOne.hex as CssColor,
        colorTwo.hex as CssColor,
      ).toFixed(1) + ':1',
    );
  };

  useEffect(() => {
    setResults();
  }, [colorOne, colorTwo]);

  return (
    <div className={classes.checker}>
      <div className={classes.items}>
        <div className={classes.item}>
          <div className={classes.label}>Foreground</div>
          <ColorInput
            color={colorOne}
            setColor={setColorOne}
            onColorClicked={() => {
              setShowPickerOne(!showPickerOne);
              setShowPickerTwo(false);
            }}
            showPicker={showPickerOne}
          />
        </div>
        <div className={classes.item}>
          <div className={classes.label}>Background</div>
          <ColorInput
            color={colorTwo}
            setColor={setColorTwo}
            onColorClicked={() => {
              setShowPickerTwo(!showPickerTwo);
              setShowPickerOne(false);
            }}
            showPicker={showPickerTwo}
          />
        </div>
      </div>
      <div
        className={classes.result}
        onClick={() => {
          setShowPickerOne(false);
          setShowPickerTwo(false);
        }}
      >
        {result}
      </div>
    </div>
  );
};
