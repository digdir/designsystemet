import {
  Button,
  Divider,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { generateColorSchemes } from '@digdir/designsystemet/color';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store';
import { Scale } from '../Scale/Scale';
import classes from './Colors.module.css';

export const Colors = () => {
  const colors = useThemeStore((state) => state.colors);
  const colorMetadata = useThemeStore((state) => state.colorMetadata);
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );
  const updateColorTheme = useThemeStore((state) => state.updateColorTheme);
  const [showStatus, setShowStatus] = useState(false);
  const colorScheme = useThemeStore((state) => state.colorScheme);

  useEffect(() => {
    const updatedMainColors = colors.main.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
        color.settings,
      );
      return {
        name: color.name,
        settings: color.settings,
        colors: updatedColors,
      };
    });

    const updatedNeutralColors = colors.neutral.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
        color.settings,
      );
      return {
        name: color.name,
        settings: color.settings,
        colors: updatedColors,
      };
    });

    const updatedSupportColors = colors.support.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
        color.settings,
      );
      return {
        name: color.name,
        settings: color.settings,
        colors: updatedColors,
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
  }, [colorMetadata]);

  const tomato = (color: { name: string; luminance: { light: number } }) => {
    const colorName = color.name as keyof typeof referenceColorMetadata;
    if (
      referenceColorMetadata[colorName]?.luminance.light !==
      color.luminance.light
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className={classes.page}>
      <Heading className={classes.title}>Fargeskalaer</Heading>
      <Paragraph className={classes.desc} data-size='sm'>
        Her kan du se en oversikt over fargeskalaene dine.
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
            onClick={() => setShowStatus(!showStatus)}
          >
            {showStatus ? 'Skjul statusfarger' : 'Vis statusfarger'}
            <ChevronDownIcon title='a11y-title' fontSize='1.5rem' />
          </Button>
        </div>
        {showStatus &&
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
