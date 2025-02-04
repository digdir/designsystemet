import {
  type CssColor,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';
import { type IColor, useColor } from 'react-color-palette';
import { ColorInput } from '../ColorInput/ColorInput';
import classes from './ContrastChecker.module.css';

type ColorInputProps = {
  color: IColor;
  setColor: (color: IColor) => void;
  showPicker: boolean;
  onColorClicked: () => void;
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
      <div className={classes.heading}>Contrast checker</div>
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
            position='top'
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
            position='top'
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
