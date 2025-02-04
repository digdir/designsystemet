import { getLuminanceFromLightness } from '@/packages/cli/dist/src';
import chroma from 'chroma-js';
import { useState } from 'react';
import { useColor } from 'react-color-palette';
import { ColorInput } from '../ColorInput/ColorInput';
import classes from './ColorInfo.module.css';

export const ColorInfo = () => {
  const [colorOne, setColorOne] = useColor('#0062BA');
  const [colorTwo, setColorTwo] = useColor('#FFFFFF');
  const [showPickerOne, setShowPickerOne] = useState(false);
  const [showPickerTwo, setShowPickerTwo] = useState(false);

  const getResult = (color: string) => {
    const chromaColor = chroma(color);
    const luminance = chromaColor.luminance().toFixed(2);
    const temperature = chromaColor.temperature();
    const rgb = chromaColor.rgb();
    const oklch = chromaColor.oklch();
    const oklchLightness = oklch[0].toFixed(2);

    getLuminanceFromLightness;

    return (
      <div className={classes.result}>
        <div className={classes.resultItem}>
          <div className={classes.resultLabel}>RGB</div>
          <div className={classes.resultValue}>
            {rgb[0]} {rgb[1]} {rgb[2]}
          </div>
        </div>
        <div className={classes.resultItem}>
          <div className={classes.resultLabel}>Luminance</div>
          <div className={classes.resultValue}>{luminance}</div>
        </div>
        <div className={classes.resultItem}>
          <div className={classes.resultLabel}>Temperature</div>
          <div className={classes.resultValue}>{temperature}</div>
        </div>
        <div className={classes.resultItem}>
          <div className={classes.resultLabel}>OKLCH</div>
          <div className={classes.resultValue}>
            {oklch[0].toFixed(2)} {oklch[1].toFixed(2)} {oklch[2].toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Color info and comparison</div>

      <div className={classes.items}>
        <div className={classes.item}>
          <div className={classes.label}>Color 1</div>
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
          {getResult(colorOne.hex)}
        </div>
        <div className={classes.item}>
          <div className={classes.label}>Color 2</div>
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
          {getResult(colorTwo.hex)}
        </div>
      </div>
    </div>
  );
};
