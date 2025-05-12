import { Heading } from '@digdir/designsystemet-react';
import {
  type ColorNames,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './ContrastRules.module.css';

export const ContrastRules = () => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const colors = useThemeStore((state) => state.colors);
  const colorsToTestAgainst: ColorNames[] = [
    'background-default',
    'background-tinted',
    'surface-default',
    'surface-tinted',
    'surface-hover',
    'surface-active',
  ];

  const [textDefaultOutput, setTextDefaultOutput] = useState<
    Partial<Record<ColorNames, { success: string[]; fail: string[] }>>
  >({
    'text-default': {
      success: [],
      fail: [],
    },
    'text-subtle': {
      success: [],
      fail: [],
    },
    'border-subtle': {
      success: [],
      fail: [],
    },
    'border-default': {
      success: [],
      fail: [],
    },
    'border-strong': {
      success: [],
      fail: [],
    },
  });

  const tomato = (name: ColorNames, contrast: number) => {
    for (const colorName of colorsToTestAgainst) {
      const hex1 = colors.main[0].colors[colorScheme].find(
        (color) => color.name === colorName,
      )?.hex;
      const hex2 = colors.main[0].colors[colorScheme].find(
        (color) => color.name === name,
      )?.hex;

      if (hex1 && hex2 && getContrastFromHex(hex1, hex2) >= contrast) {
        setTextDefaultOutput((prev) => ({
          ...prev,
          [name]: {
            success: Array.from(
              new Set([...(prev[name]?.success || []), colorName]),
            ),
            fail: prev[name]?.fail || [],
          },
        }));
      } else {
        setTextDefaultOutput((prev) => ({
          ...prev,
          [name]: {
            success: prev[name]?.success || [],
            fail: Array.from(new Set([...(prev[name]?.fail || []), colorName])),
          },
        }));
      }
    }
  };

  useEffect(() => {
    setTextDefaultOutput((prev) => ({
      ...prev,
      'text-default': {
        success: [],
        fail: [],
      },
      'text-subtle': {
        success: [],
        fail: [],
      },
      'border-subtle': {
        success: [],
        fail: [],
      },
      'border-default': {
        success: [],
        fail: [],
      },
      'border-strong': {
        success: [],
        fail: [],
      },
    }));

    tomato('text-default', 4.6);
    tomato('text-subtle', 4.6);
    tomato('border-subtle', 3.1);
    tomato('border-default', 3.1);
    tomato('border-strong', 3.1);
  }, [colors, colorScheme]);

  const Test = (name: ColorNames, type: 'text' | 'decorative') => {
    return (
      <div>
        {(textDefaultOutput[name]?.fail?.length ?? 0) === 0 ? (
          <div>
            Kan brukes som{' '}
            {type === 'text' ? 'tekstfarge' : 'meningsbærende farge'} mot alle
            overflatefargene.
          </div>
        ) : (textDefaultOutput[name]?.fail?.length ?? 0) === 6 ? (
          <div>
            Kan ikke brukes som{' '}
            {type === 'text' ? 'tekstfarge' : 'meningsbærende farge'} mot noen
            overflatefarger.
          </div>
        ) : (
          <span>
            Kan brukes som{' '}
            {type === 'text' ? 'tekstfarge' : 'meningsbærende farge'} mot alle
            overflatefargene utenom:
            {textDefaultOutput[name]?.fail.map((color, i) => (
              <span key={i} className={classes.failColor}>
                {color}
              </span>
            ))}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={classes.ruleContainer} data-color-scheme={colorScheme}>
      <Heading data-size='xs' className={classes.heading}>
        Kontrastregler for temaet ditt
      </Heading>
      <div className={classes.rules}>
        <div className={classes.rule}>
          <div className={classes.title}>Text Default:</div>
          {Test('text-default', 'text')}
        </div>
        <div className={classes.rule}>
          <div className={classes.title}>Text Subtle:</div>
          {Test('text-subtle', 'text')}
        </div>
        <div className={classes.rule}>
          <div className={classes.title}>Border Subtle:</div>
          {Test('border-subtle', 'decorative')}
        </div>
        <div className={classes.rule}>
          <div className={classes.title}>Border Default:</div>
          {Test('border-default', 'decorative')}
        </div>
        <div className={classes.rule}>
          <div className={classes.title}>Border Strong:</div>
          {Test('border-strong', 'decorative')}
        </div>
      </div>
    </div>
  );
};
