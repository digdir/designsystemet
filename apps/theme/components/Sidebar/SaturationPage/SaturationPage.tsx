import { Button, Heading } from '@digdir/designsystemet-react';
import {
  type CssColor,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { Slider } from '../../Slider/Slider';
import classes from './SaturationPage.module.css';

type SaturationPageProps = {
  index: number;
  color: string;
  colorType: 'main' | 'neutral' | 'support';
  onBackClicked: () => void;
  name: string;
};

export const SaturationPage = ({
  index,
  color,
  colorType,
  onBackClicked,
  name,
}: SaturationPageProps) => {
  const getColorTheme = useThemeStore((state) => state.getColorTheme);
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const handleSaturationChange = (value: number, type: string) => {
    const colorTheme = getColorTheme(index, colorType);
    if (!colorTheme) return;

    for (const key of Object.keys(colorTheme.colorMetadata) as Array<
      keyof typeof colorTheme.colorMetadata
    >) {
      if (key.startsWith(type)) {
        colorTheme.colorMetadata[key].saturation.light = value / 100 + 1;
      }
    }

    const updatedColors = generateColorSchemes(
      color as CssColor,
      colorTheme.colorMetadata,
    );

    updateColorTheme(
      {
        ...colorTheme,
        colors: updatedColors,
      },
      index,
      colorType,
    );
  };

  return (
    <div>
      <Button
        data-size='sm'
        variant='tertiary'
        onClick={() => {
          onBackClicked();
        }}
        className={classes.back}
      >
        <ChevronLeftIcon aria-hidden fontSize='1.5rem' /> Gå tilbake
      </Button>
      <div className={classes.preview}>
        <div className={classes.color} style={{ backgroundColor: color }}></div>
        <div className={classes.colorName}>{name}</div>
      </div>
      <Heading data-size='xs' className={classes.heading}>
        Fargemetning
      </Heading>

      <div className={classes.group}>
        <Slider
          label='Background fargene'
          min={-50}
          max={50}
          initialValue={0}
          onReset={(value) => {
            handleSaturationChange(value, 'background');
          }}
          onChange={(value) => {
            handleSaturationChange(value, 'background');
          }}
        />
        <Slider
          label='Surface fargene'
          min={-50}
          max={50}
          initialValue={0}
          onChange={(value) => {
            handleSaturationChange(value, 'surface');
          }}
          onReset={(value) => {
            handleSaturationChange(value, 'surface');
          }}
        />
        <Slider
          label='Border fargene'
          min={-50}
          max={50}
          initialValue={0}
          onChange={(value) => {
            handleSaturationChange(value, 'border');
          }}
          onReset={(value) => {
            handleSaturationChange(value, 'border');
          }}
        />
        <Slider
          label='Text fargene'
          min={-50}
          max={50}
          initialValue={0}
          onChange={(value) => {
            handleSaturationChange(value, 'text');
          }}
          onReset={(value) => {
            handleSaturationChange(value, 'text');
          }}
        />
        <Slider
          label='Base fargene'
          min={-50}
          max={50}
          initialValue={0}
          onChange={(value) => {
            handleSaturationChange(value, 'base');
          }}
          onReset={(value) => {
            handleSaturationChange(value, 'base');
          }}
        />
      </div>
    </div>
  );
};
