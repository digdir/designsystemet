import {
  Button,
  Field,
  Heading,
  Label,
  Select,
} from '@digdir/designsystemet-react';
import {
  type CssColor,
  type InterpolationMode,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { ChevronLeftIcon, FlowerIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useThemeStore } from '../../../store';
import { LightnessInput } from '../../LightnessInput/LightnessInput';
import { SaturationPage } from '../SaturationPage/SaturationPage';
import classes from './AdvancedColorPage.module.css';

type AdvancedColorPageProps = {
  onBackClicked: () => void;
  name: string;
  color: string;
  index: number;
  colorType: 'main' | 'neutral' | 'support';
};

export const AdvancedColorPage = ({
  onBackClicked,
  name,
  color,
  index,
  colorType,
}: AdvancedColorPageProps) => {
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const getColorTheme = useThemeStore((state) => state.getColorTheme);
  const [saturationPage, setSaturationPage] = useState(true);
  return (
    <div>
      {saturationPage && (
        <SaturationPage
          index={index}
          color={color}
          colorType={colorType}
          name={name}
          onBackClicked={() => setSaturationPage(false)}
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

          <Field data-size='sm' className={classes.field}>
            <Label>Velg interpolering</Label>
            <Select
              defaultValue='rgb'
              width='full'
              onChange={(e) => {
                const interpolation = e.target.value as InterpolationMode;
                const currentTheme = getColorTheme(index, colorType);

                if (!currentTheme) return;

                const updatedSettings = {
                  ...currentTheme.settings,
                  general: { interpolation },
                };

                const colors = generateColorSchemes(
                  color as CssColor,
                  colorMetadata,
                  updatedSettings,
                );

                updateColorTheme(
                  {
                    ...currentTheme,
                    colors,
                    settings: updatedSettings,
                  },
                  index,
                  colorType,
                );
              }}
            >
              {['rgb', 'oklch', 'hsl'].map((mode) => (
                <Select.Option key={mode} value={mode}>
                  {mode.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Field>

          <div className={classes.group}>
            <Heading data-size='2xs'>Fargemetning</Heading>

            <button
              className={classes.btn}
              onClick={() => setSaturationPage(true)}
            >
              <FlowerIcon title='a11y-title' fontSize='1.5rem' />
              Velg fargemetning for fargene
            </button>
          </div>

          <div className={classes.group}>
            <Heading data-size='2xs'>Base lightness i lys modus</Heading>

            <LightnessInput
              label='Base Hover'
              handleReset={() => {}}
              initialValue={50}
              oneLiner
            />

            <LightnessInput
              label='Base Active'
              handleReset={() => {}}
              initialValue={50}
              oneLiner
            />
          </div>

          <div className={classes.group}>
            <Heading data-size='2xs'>Base lightness i mørk modus</Heading>

            <LightnessInput
              label='Base Default'
              handleReset={() => {}}
              initialValue={50}
              oneLiner
            />

            <LightnessInput
              label='Base Hover'
              handleReset={() => {}}
              initialValue={50}
              oneLiner
            />

            <LightnessInput
              label='Base Active'
              handleReset={() => {}}
              initialValue={50}
              oneLiner
            />
          </div>
        </>
      )}
    </div>
  );
};
