import { Button, Heading } from '@digdir/designsystemet-react';
import {
  type CssColor,
  colorMetadata,
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

  const handleSaturationChange = (value: number) => {
    const colorTheme = getColorTheme(index, colorType);
    if (!colorTheme) return;

    colorTheme.settings.static.saturation.light.background = value / 100 + 1;

    const updatedColors = generateColorSchemes(
      color as CssColor,
      colorMetadata,
      colorTheme.settings,
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
          min={-40}
          max={40}
          initialValue={0}
          onReset={(value) => {
            handleSaturationChange(value);
          }}
          onChange={(value) => {
            handleSaturationChange(value);
          }}
        />
        <Slider
          label='Surface fargene'
          min={-40}
          max={40}
          initialValue={0}
          onChange={(value) => {}}
        />
        <Slider
          label='Border fargene'
          min={-40}
          max={40}
          initialValue={0}
          onChange={(value) => {}}
        />
        <Slider
          label='Fargemetning for Text fargene'
          min={-40}
          max={40}
          initialValue={0}
          onChange={(value) => {}}
        />
      </div>
    </div>
  );
};
