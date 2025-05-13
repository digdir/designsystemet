import {
  Button,
  Field,
  Heading,
  Label,
  Link,
  Paragraph,
  Select,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import {
  type CssColor,
  type InterpolationMode,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { type ColorTheme, useThemeStore } from '../../../store';
import { Slider } from '../../Slider/Slider';
import classes from './SaturationPage.module.css';

type SaturationPageProps = {
  index: number;
  color: string;
  colorType: 'main' | 'neutral' | 'support' | 'status';
  onBackClicked: () => void;
  name: string;
  currentTheme: ColorTheme | undefined;
};

export const SaturationPage = ({
  index,
  color,
  colorType,
  onBackClicked,
  name,
  currentTheme,
}: SaturationPageProps) => {
  const getColorTheme = useThemeStore((state) => state.getColorTheme);
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  const handleSaturationChange = (value: number, type: string) => {
    const colorTheme = getColorTheme(index, colorType);
    if (!colorTheme) return;

    for (const key of Object.keys(colorTheme.colorMetadata) as Array<
      keyof typeof colorTheme.colorMetadata
    >) {
      if (key.startsWith(type)) {
        colorTheme.colorMetadata[key].saturation[colorScheme] =
          percentToValue(value);
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

  const percentToValue = (percent: number) => {
    return percent / 100 + 1;
  };

  const valueToPercent = (value: number) => {
    return Math.round((value - 1) * 100);
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

      <Field data-size='sm' className={classes.field}>
        <Label>Interpolering</Label>
        <Paragraph data-size='sm'>
          Interpolering endrer fargemetningen for fargene. Les mer om hvordan
          dette fungerer <Link href='#'>her (TODO)</Link>.
        </Paragraph>
        <Select
          className={classes.select}
          width='full'
          value={
            currentTheme?.colorMetadata['background-default'].interpolation
          }
          onChange={(e) => {
            const interpolation = e.target.value as InterpolationMode;
            const currentTheme = getColorTheme(index, colorType);

            if (!currentTheme) return;

            for (const metadata of Object.values(currentTheme.colorMetadata)) {
              metadata.interpolation = interpolation as InterpolationMode;
            }

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
          }}
        >
          {['rgb', 'hsl', 'hsv', 'lab', 'lch', 'oklab', 'oklch']
            .sort()
            .map((mode) => (
              <Select.Option key={mode} value={mode}>
                {mode.toUpperCase()}
              </Select.Option>
            ))}
        </Select>
      </Field>

      <Heading data-size='2xs' className={classes.subHeading}>
        Fargemetning for hver av farge-gruppene
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
        <Slider
          label='Background fargene'
          min={-50}
          max={50}
          initialValue={colorScheme === 'light' ? 0 : -30}
          value={valueToPercent(
            currentTheme?.colorMetadata['background-default'].saturation[
              colorScheme
            ] ?? 0,
          )}
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
          initialValue={colorScheme === 'light' ? 0 : -30}
          value={valueToPercent(
            currentTheme?.colorMetadata['surface-default'].saturation[
              colorScheme
            ] ?? 0,
          )}
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
          initialValue={colorScheme === 'light' ? 0 : -20}
          value={valueToPercent(
            currentTheme?.colorMetadata['border-subtle'].saturation[
              colorScheme
            ] ?? 0,
          )}
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
          initialValue={colorScheme === 'light' ? 0 : -20}
          value={valueToPercent(
            currentTheme?.colorMetadata['text-default'].saturation[
              colorScheme
            ] ?? 0,
          )}
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
          initialValue={colorScheme === 'light' ? 0 : -30}
          value={valueToPercent(
            currentTheme?.colorMetadata['base-default'].saturation[
              colorScheme
            ] ?? 0,
          )}
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
