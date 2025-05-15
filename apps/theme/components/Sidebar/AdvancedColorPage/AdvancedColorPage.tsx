import { Button, Heading, ToggleGroup } from '@digdir/designsystemet-react';
import {
  type CssColor,
  generateColorSchemes,
  getBaseDarkLightness,
} from '@digdir/designsystemet/color';
import { ChevronLeftIcon, PaletteIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../../store';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import { SaturationPage } from '../SaturationPage/SaturationPage';
import classes from './AdvancedColorPage.module.css';

type AdvancedColorPageProps = {
  onBackClicked: () => void;
  name: string;
  color: string;
  index: number;
  colorType: 'main' | 'neutral' | 'support' | 'status';
};

export const AdvancedColorPage = ({
  onBackClicked,
  name,
  color,
  index,
  colorType,
}: AdvancedColorPageProps) => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const getColorTheme = useThemeStore((state) => state.getColorTheme);
  const [saturationPage, setSaturationPage] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() =>
    getColorTheme(index, colorType),
  );
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const [baseDarkLightness, setBaseDarkLightness] = useState(-1);

  const handleStepChange = (value: number) => {
    if (currentTheme) {
      currentTheme.colorMetadata['base-default'].baseModifier[colorScheme] =
        value;
      const colors = generateColorSchemes(
        color as CssColor,
        currentTheme.colorMetadata,
      );

      updateColorTheme(
        {
          ...currentTheme,
          colors,
        },
        index,
        colorType,
      );
    }
  };

  useEffect(() => {
    setCurrentTheme(getColorTheme(index, colorType));
  }, [index, colorType, getColorTheme]);

  useEffect(() => {
    setBaseDarkLightness(
      parseInt(getBaseDarkLightness(color as CssColor).toFixed(2)),
    );
  }, [currentTheme]);
  return (
    <div>
      {saturationPage && (
        <SaturationPage
          index={index}
          color={color}
          colorType={colorType}
          name={name}
          onBackClicked={() => setSaturationPage(false)}
          currentTheme={currentTheme}
        />
      )}

      {!saturationPage && (
        <>
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
            <div
              className={classes.color}
              style={{ backgroundColor: color }}
            ></div>
            <div className={classes.colorName}>{name}</div>
          </div>
          <Heading data-size='xs' className={classes.heading}>
            Avanserte fargeinnstillinger
          </Heading>

          <div className={classes.group}>
            <button
              className={classes.btn}
              onClick={() => setSaturationPage(true)}
            >
              <PaletteIcon title='a11y-title' fontSize='1.55rem' />
              Velg fargemetning for fargene
            </button>
          </div>

          <Heading data-size='2xs' className={classes.subHeading}>
            Instillinger for Base fargene
          </Heading>

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

          <div className={classes.group}>
            {colorScheme === 'dark' && (
              <LightnessInput
                label='Base Default lightness'
                description='Som standard blir lightness for Base Default fargen satt til det motsatt av det den er i lys modus.'
                value={
                  currentTheme?.colorMetadata['base-default'].lightness[
                    colorScheme
                  ] === -1
                    ? baseDarkLightness
                    : (currentTheme?.colorMetadata['base-default'].lightness[
                        colorScheme
                      ] ?? baseDarkLightness)
                }
                initialValue={baseDarkLightness}
                onChange={(value) => {
                  if (currentTheme) {
                    currentTheme.colorMetadata['base-default'].lightness[
                      colorScheme
                    ] = value;
                    const colors = generateColorSchemes(
                      color as CssColor,
                      currentTheme.colorMetadata,
                    );

                    updateColorTheme(
                      {
                        ...currentTheme,
                        colors,
                      },
                      index,
                      colorType,
                    );
                  }
                }}
                onReset={() => {
                  const test = getBaseDarkLightness(color as CssColor).toFixed(
                    2,
                  );
                  if (currentTheme) {
                    currentTheme.colorMetadata['base-default'].lightness.dark =
                      parseInt(test);
                    const colors = generateColorSchemes(
                      color as CssColor,
                      currentTheme.colorMetadata,
                    );

                    updateColorTheme(
                      {
                        ...currentTheme,
                        colors,
                      },
                      index,
                      colorType,
                    );
                  }
                }}
              />
            )}

            <LightnessInput
              label='Steg modifikator'
              description='Velg hvor mye lightness som skal øke eller minske for hvert steg for Base Hover- og Active fargene.'
              value={
                currentTheme?.colorMetadata['base-default'].baseModifier[
                  colorScheme
                ] ?? 8
              }
              initialValue={8}
              onChange={(value) => handleStepChange(value)}
              onReset={(value) => handleStepChange(value)}
            />
          </div>
          {colorScheme === 'dark' && <div className={classes.group}></div>}
        </>
      )}
    </div>
  );
};
