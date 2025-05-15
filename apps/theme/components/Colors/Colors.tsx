import {
  Button,
  Divider,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import {
  type CssColor,
  generateColorSchemes,
  getBaseDarkLightness,
} from '@digdir/designsystemet/color';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { useThemeStore } from '../../store';
import { Scale } from '../Scale/Scale';
import classes from './Colors.module.css';

export const Colors = () => {
  const colors = useThemeStore((state) => state.colors);
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );

  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const onColorThemeChange = useThemeStore((state) => state.onColorThemeChange);
  const showStatusColors = useThemeStore((state) => state.showStatusColors);
  const setShowStatusColors = useThemeStore(
    (state) => state.setShowStatusColors,
  );

  useEffect(() => {
    const updatedMainColors = colors.main.map((color) => {
      color.colorMetadata['base-default'].lightness.dark = getBaseDarkLightness(
        color.colors.light[11].hex as CssColor,
      );
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        color.colorMetadata,
      );
      return {
        name: color.name,
        colors: updatedColors,
        colorMetadata: color.colorMetadata,
      };
    });

    const updatedNeutralColors = colors.neutral.map((color) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        color.colorMetadata,
      );
      return {
        name: color.name,
        colors: updatedColors,
        colorMetadata: color.colorMetadata,
      };
    });

    const updatedSupportColors = colors.support.map((color) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        color.colorMetadata,
      );
      return {
        name: color.name,
        colors: updatedColors,
        colorMetadata: color.colorMetadata,
      };
    });

    const updatedStatusColors = colors.status.map((color) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        color.colorMetadata,
      );
      return {
        name: color.name,
        colors: updatedColors,
        colorMetadata: color.colorMetadata,
      };
    });

    updatedMainColors.forEach((colorTheme, index) => {
      updateColorTheme(colorTheme, index, 'main');
    });

    updatedNeutralColors.forEach((colorTheme, index) => {
      updateColorTheme(colorTheme, index, 'neutral');
    });

    updatedSupportColors.forEach((colorTheme, index) => {
      updateColorTheme(colorTheme, index, 'support');
    });
    updatedStatusColors.forEach((colorTheme, index) => {
      updateColorTheme(colorTheme, index, 'status');
    });
  }, [onColorThemeChange]);

  return (
    <div className={classes.page}>
      <Heading className={classes.title}>Fargeskalaer</Heading>
      <Paragraph className={classes.desc} data-size='sm'>
        Her kan du se fargeskalaene dine. Merk at du kan ikke endre navn på
        status fargene eller neutral fargen.
      </Paragraph>
      <div className={classes.rows} data-color-scheme={colorScheme}>
        {colors.main.map((color, index) => (
          <div key={index} className={classes.row}>
            <div className={classes.scaleLabel}>{color.name}</div>
            <Scale
              colorScale={color.colors}
              showHeader={index === 0}
              showColorMeta={false}
              namespace={color.name}
            />
          </div>
        ))}
        <Divider />
        {colors.neutral.map((color, index) => (
          <div key={index} className={classes.row}>
            <div className={classes.scaleLabel}>{color.name}</div>
            <Scale
              colorScale={color.colors}
              namespace={color.name}
              showColorMeta={false}
            />
          </div>
        ))}
        <Divider />
        {colors.support.map((color, index) => (
          <div key={index} className={classes.row}>
            <div className={classes.scaleLabel}>{color.name}</div>
            <Scale
              colorScale={color.colors}
              namespace={color.name}
              showColorMeta={false}
            />
          </div>
        ))}
        <div className={classes.showContainer}>
          <Button
            data-size='sm'
            variant='secondary'
            data-color='neutral'
            className={classes.showBtn}
            onClick={() => setShowStatusColors(!showStatusColors)}
          >
            {showStatusColors ? 'Skjul statusfarger' : 'Vis statusfarger'}
            <ChevronDownIcon title='a11y-title' fontSize='1.5rem' />
          </Button>
        </div>
        {showStatusColors &&
          colors.status.map((color, index) => (
            <div key={index} className={classes.row}>
              <div className={classes.scaleLabel}>{color.name}</div>
              <Scale
                colorScale={color.colors}
                namespace={color.name}
                showColorMeta={false}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
