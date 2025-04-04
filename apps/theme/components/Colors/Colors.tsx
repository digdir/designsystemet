import { Divider } from '@digdir/designsystemet-react';
import { generateColorSchemes } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useEffect } from 'react';
import { useThemeStore } from '../../store';
import { Scale } from '../Scale/Scale';
import classes from './Colors.module.css';

export const Colors = () => {
  const colors = useThemeStore((state) => state.colors);
  const colorMetadata = useThemeStore((state) => state.colorMetadata);
  const referenceColorMetadata = useThemeStore(
    (state) => state.referenceColorMetadata,
  );
  const updateColor = useThemeStore((state) => state.updateColor);

  useEffect(() => {
    const updatedMainColors = colors.main.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
      );
      return {
        name: color.name,
        staticSaturation: color.staticSaturation,
        colors: updatedColors,
      };
    });

    const updatedNeutralColors = colors.neutral.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
      );
      return {
        name: color.name,
        staticSaturation: color.staticSaturation,
        colors: updatedColors,
      };
    });

    const updatedSupportColors = colors.support.map((color, index) => {
      const updatedColors = generateColorSchemes(
        color.colors.light[11].hex,
        colorMetadata,
      );
      return {
        name: color.name,
        staticSaturation: color.staticSaturation,
        colors: updatedColors,
      };
    });

    updatedMainColors.forEach((color, index) => {
      updateColor(color, index, 'main');
    });

    updatedNeutralColors.forEach((color, index) => {
      updateColor(color, index, 'neutral');
    });

    updatedSupportColors.forEach((color, index) => {
      updateColor(color, index, 'support');
    });
  }, [colorMetadata]);

  const tomato = (color: { name: string; luminance: { light: number } }) => {
    const colorName = color.name as keyof typeof referenceColorMetadata;
    console.log(
      referenceColorMetadata[colorName]?.luminance.light,
      color.luminance.light,
    );
    if (
      referenceColorMetadata[colorName]?.luminance.light !==
      color.luminance.light
    ) {
      return true;
    }
    return false;
  };

  const Input = ({
    color,
  }: { color: { name: string; luminance: { light: number } } }) => {
    return (
      <div className={classes.inputContainer}>
        <input
          className={cl(classes.input, tomato(color) && classes.activeInput)}
          type='text'
          defaultValue={color.luminance.light.toFixed(1)}
          onChange={(e) => {
            const newColorMetadata = { ...colorMetadata };
            const test = parseFloat(e.target.value);

            if (color.name in newColorMetadata) {
              newColorMetadata[
                color.name as keyof typeof newColorMetadata
              ].luminance.light = test;
            }
            useThemeStore.setState({
              colorMetadata: newColorMetadata,
            });
          }}
        />
      </div>
    );
  };

  return (
    <div className={classes.rows}>
      {/* <div className={classes.luminance}>
        <Heading>Luminans</Heading>
        <Paragraph>fssf</Paragraph>
        <div className={classes.inputs}>
          {Object.values(colorMetadata)
            .filter((color) => !color.name.includes('base'))
            .map((color, index) => (
              <Input key={index} color={color} />
            ))}
        </div>
      </div> */}
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
    </div>
  );
};
