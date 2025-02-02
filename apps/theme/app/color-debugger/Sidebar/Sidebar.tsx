import { Field, Heading, Select } from '@digdir/designsystemet-react';
import type { InterpolationMode } from 'chroma-js';

import { getColorInfoFromPosition } from '@/packages/cli/dist/src';
import { DoubleInput } from '../DoubleInput/DoubleInput';
import { RangeBar } from '../RangeBar/RangeBar';
import { useDebugStore } from '../debugStore';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const setThemeSettings = useDebugStore((state) => state.setThemeSettings);

  return (
    <div className={classes.sidebar}>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          General
        </Heading>
        <div className={classes.group}>
          <div className={classes.select}>
            <div>Color scheme</div>
            <div className={classes.field}>
              <Field data-size='xs'>
                <Select onChange={(e) => {}}>
                  <Select.Option value='light'>Light Mode</Select.Option>
                  <Select.Option value='dark'>Dark Mode</Select.Option>
                </Select>
              </Field>
            </div>
          </div>
          <div className={classes.select}>
            <div>Test mode</div>
            <div className={classes.field}>
              <Field data-size='xs'>
                <Select
                  onChange={(e) => {
                    setThemeSettings({
                      ...themeSettings,
                      general: {
                        ...themeSettings.general,
                        testMode: e.target.value as 'debug' | 'production',
                      },
                    });
                  }}
                >
                  <Select.Option value='debug'>Debug</Select.Option>
                  <Select.Option value='production'>Production</Select.Option>
                </Select>
              </Field>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Base colors
        </Heading>

        <div className={classes.group}>
          <DoubleInput
            label='Base Default dark offset'
            valueOne={'0'}
            setValueOne={(e) => {}}
          />
          <DoubleInput
            label='Step Modifier'
            valueOne={themeSettings.base.modifier.toString()}
            setValueOne={(e) => {
              console.log(e);
              setThemeSettings({
                ...themeSettings,
                base: {
                  ...themeSettings.base,
                  modifier: parseFloat(e),
                },
              });
            }}
          />
          <DoubleInput
            label='Negative mod min'
            valueOne={themeSettings.base.negativeModeMin.toString()}
            setValueOne={(e) => {
              setThemeSettings({
                ...themeSettings,
                base: {
                  ...themeSettings.base,
                  negativeModeMin: parseFloat(e),
                },
              });
            }}
          />
          <DoubleInput
            label='Negative mod range'
            valueOne={themeSettings.base.negativeModRangeMin.toString()}
            setValueOne={(e) => {
              setThemeSettings({
                ...themeSettings,
                base: {
                  ...themeSettings.base,
                  negativeModRangeMin: parseFloat(e),
                },
              });
            }}
            valueTwo={themeSettings.base.negativeModRangeMax.toString()}
            setValueTwo={(e) => {
              setThemeSettings({
                ...themeSettings,
                base: {
                  ...themeSettings.base,
                  negativeModRangeMax: parseFloat(e),
                },
              });
            }}
          />
          <RangeBar
            min={themeSettings.base.negativeModeMin}
            rangeMin={themeSettings.base.negativeModRangeMin}
            rangeMax={themeSettings.base.negativeModRangeMax}
          />
        </div>
      </div>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Contrast Subtle
        </Heading>
        <div className={classes.group}>
          <DoubleInput
            label='Default lightness'
            valueOne={'50'}
            setValueOne={(e) => {}}
          />
          <DoubleInput
            label='Custom mod range'
            valueOne={themeSettings.contrastSubtle.customModRangeMin.toString()}
            setValueOne={(e) => {
              setThemeSettings({
                ...themeSettings,
                contrastSubtle: {
                  ...themeSettings.contrastSubtle,
                  customModRangeMin: parseFloat(e),
                },
              });
            }}
            valueTwo={themeSettings.contrastSubtle.customModRangeMax.toString()}
            setValueTwo={(e) => {
              setThemeSettings({
                ...themeSettings,
                contrastSubtle: {
                  ...themeSettings.contrastSubtle,
                  customModRangeMax: parseFloat(e),
                },
              });
            }}
          />
          <DoubleInput
            label='Custom modifier result'
            valueOne={themeSettings.contrastSubtle.customModResult.toString()}
            setValueOne={(e) => {
              setThemeSettings({
                ...themeSettings,
                contrastSubtle: {
                  ...themeSettings.contrastSubtle,
                  customModResult: parseFloat(e),
                },
              });
            }}
          />
          <RangeBar
            min={0}
            rangeMin={themeSettings.contrastSubtle.customModRangeMin}
            rangeMax={themeSettings.contrastSubtle.customModRangeMax}
            barActiveColor='#797979'
          />
        </div>
      </div>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Interpolation
        </Heading>
        <div className={classes.select}>
          <div>Mode</div>
          <div className={classes.field}>
            <Field data-size='xs'>
              <Select
                onChange={(e) => {
                  setThemeSettings({
                    ...themeSettings,
                    interpolation: {
                      mode: e.target.value as InterpolationMode,
                    },
                  });
                }}
              >
                <Select.Option value='rgb'>RGB</Select.Option>
                <Select.Option value='hsl'>HSL</Select.Option>
                <Select.Option value='hsv'>HSV</Select.Option>
                <Select.Option value='hsi'>HSI</Select.Option>
                <Select.Option value='lab'>LAB</Select.Option>
                <Select.Option value='hcl'>HCL</Select.Option>
                <Select.Option value='lrgb'>lRGB</Select.Option>
                <Select.Option value='oklch'>OKLCH</Select.Option>
                <Select.Option value='oklab'>OKLab</Select.Option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Luminance values
        </Heading>
        <div className={classes.group}>
          {Object.keys(luminance.light).map((key, index) => {
            if (
              index === 11 ||
              index === 12 ||
              index === 13 ||
              index === 14 ||
              index === 15
            ) {
              return null;
            }
            return (
              <div key={key}>
                <DoubleInput
                  label={getColorInfoFromPosition(index + 1).displayName}
                  valueOne={luminance.light[
                    key as keyof typeof luminance.light
                  ].toString()}
                  valueTwo={luminance.dark[
                    key as keyof typeof luminance.light
                  ].toString()}
                  setValueOne={(value) => {
                    const newLuminance = { ...luminance };
                    newLuminance.light[key as keyof typeof luminance.light] =
                      parseFloat(value);
                    useDebugStore.setState({
                      luminance: newLuminance,
                    });
                  }}
                  setValueTwo={(value) => {
                    const newLuminance = { ...luminance };
                    newLuminance.dark[key as keyof typeof luminance.light] =
                      parseFloat(value);
                    useDebugStore.setState({
                      luminance: newLuminance,
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
