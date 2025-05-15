import {
  Button,
  Heading,
  Paragraph,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import type { ColorMetadata } from '@digdir/designsystemet/color';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useThemeStore } from '../../../store';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import classes from './LightnessPage.module.css';

type LightnessPageProps = {
  onBackClicked: () => void;
};

export const LightnessPage = ({ onBackClicked }: LightnessPageProps) => {
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const onColorThemeChange = useThemeStore((state) => state.onColorThemeChange);
  const setOnColorThemeChange = useThemeStore(
    (state) => state.setOnColorThemeChange,
  );
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const colors = useThemeStore((state) => state.colors);

  const handleLightnessChange = (value: number, color: ColorMetadata) => {
    colors.main.map((colorTheme, i) => {
      colorTheme.colorMetadata[color.name].lightness[colorScheme] = value;
      updateColorTheme(colorTheme, i, 'main');
    });
    colors.neutral.map((colorTheme, i) => {
      colorTheme.colorMetadata[color.name].lightness[colorScheme] = value;
      updateColorTheme(colorTheme, i, 'neutral');
    });
    colors.support.map((colorTheme, i) => {
      colorTheme.colorMetadata[color.name].lightness[colorScheme] = value;
      updateColorTheme(colorTheme, i, 'support');
    });
    colors.status.map((colorTheme, i) => {
      colorTheme.colorMetadata[color.name].lightness[colorScheme] = value;
      updateColorTheme(colorTheme, i, 'status');
    });

    setOnColorThemeChange(onColorThemeChange + 1);
  };

  return (
    <div className={classes.page}>
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
      <Heading className={classes.heading} data-size='xs'>
        Velg lightness
      </Heading>
      <Paragraph data-size='sm' className={classes.description}>
        Juster på HSLuv lightness for fargene i temaet ditt. Dette vil påvirke
        alle fargene på tvers av fargeskalaer.
      </Paragraph>
      <ToggleGroup
        value={colorScheme}
        name='toggle-group-nuts'
        data-size='sm'
        data-color='neutral'
        className='subtle-toggle-group'
        onChange={(value) => {
          setColorScheme(value as 'light' | 'dark');
        }}
      >
        <ToggleGroup.Item value='light'>Lys modus</ToggleGroup.Item>
        <ToggleGroup.Item value='dark'>Mørk modus</ToggleGroup.Item>
      </ToggleGroup>

      <div className={classes.luminance}>
        <div className={classes.inputs}>
          {Object.values(referenceColorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, refIndex) =>
              refIndex === 11 ? null : (
                <LightnessInput
                  key={refIndex}
                  label={color.displayName}
                  oneLiner
                  value={
                    colors.main[0].colorMetadata[color.name].lightness[
                      colorScheme
                    ]
                  }
                  initialValue={
                    referenceColorMetadata[color.name].lightness[colorScheme]
                  }
                  onChange={(value) => {
                    handleLightnessChange(value, color);
                  }}
                  onReset={(value) => {
                    handleLightnessChange(value, color);
                  }}
                />
              ),
            )}
        </div>
      </div>
    </div>
  );
};
