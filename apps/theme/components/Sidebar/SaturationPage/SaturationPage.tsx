import { Heading } from '@digdir/designsystemet-react';
import {
  type CssColor,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { useThemeStore } from '../../../store';
import { Slider } from '../../Slider/Slider';
import classes from './SaturationPage.module.css';

type SaturationPageProps = {
  index: number;
  color: string;
  colorType: 'main' | 'neutral' | 'support';
};

export const SaturationPage = ({
  index,
  color,
  colorType,
}: SaturationPageProps) => {
  const getColorTheme = useThemeStore((state) => state.getColorTheme);
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);

  const handleSaturationChange = (value: number) => {
    const colorTheme = getColorTheme(index, colorType);
    if (!colorTheme) return;

    colorTheme.settings.static.lightSaturation = value / 100 + 1;

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
      <div className={classes.group}>
        <Heading data-size='2xs'>Dark mode</Heading>

        <Slider
          label='Fargemetning for Background fargene'
          min={-40}
          max={40}
          initialValue={-20}
          onChange={(value) => {}}
        />
        <Slider
          label='Fargemetning for Text fargene'
          min={-40}
          max={40}
          initialValue={-10}
          onChange={(value) => {}}
        />
      </div>

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
  );
};
