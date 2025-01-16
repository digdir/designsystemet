import { Field, Heading, Select } from '@digdir/designsystemet-react';
import type { InterpolationMode } from 'chroma-js';

import { DoubleInput } from '../DoubleInput/DoubleInput';
import { useDebugStore } from '../debugStore';
import { getFullNameFromShort } from '../logic/utils';
import classes from './Sidebar.module.css';
import 'rc-slider/assets/index.css';

import {} from 'react-range';

export const Sidebar = () => {
  const luminance = useDebugStore((state) => state.luminance);

  const setInterpolationMode = useDebugStore(
    (state) => state.setInterpolationMode,
  );
  const baseModifier = useDebugStore((state) => state.baseModifier);
  const setBaseModifier = useDebugStore((state) => state.setBaseModifier);

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
                <Select onChange={(e) => {}}>
                  <Select.Option value='light'>Debug</Select.Option>
                  <Select.Option value='dark'>Production</Select.Option>
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
            valueOne={baseModifier.toString()}
            setValueOne={(e) => {
              console.log(e);
              setBaseModifier(parseInt(e));
            }}
          />
          <DoubleInput
            label='Negative mod min'
            valueOne={'30'}
            setValueOne={(e) => {}}
          />
          <DoubleInput
            label='Negative mod range'
            valueOne={'45'}
            setValueOne={(e) => {}}
            valueTwo={'69'}
            setValueTwo={(e) => {}}
          />
        </div>
      </div>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Contrast Subtle
        </Heading>
        <div className={classes.group}>
          <DoubleInput
            label='Default lightness modifier'
            valueOne={'50'}
            setValueOne={(e) => {}}
          />
          <DoubleInput
            label='Custom mod range'
            valueOne={'40'}
            setValueOne={(e) => {}}
            valueTwo={'60'}
            setValueTwo={(e) => {}}
          />
          <DoubleInput
            label='Custom modifier result'
            valueOne={'60'}
            setValueOne={(e) => {}}
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
                  setInterpolationMode(e.target.value as InterpolationMode);
                }}
              >
                <Select.Option value='rgb'>RGB</Select.Option>
                <Select.Option value='hsl'>HSL</Select.Option>
                <Select.Option value='hsv'>HSV</Select.Option>
                <Select.Option value='hsi'>HSI</Select.Option>
                <Select.Option value='lab'>LAB</Select.Option>
                <Select.Option value='oklab'>OKLab</Select.Option>
                <Select.Option value='hcl'>HCL</Select.Option>
                <Select.Option value='lrgb'>lRGB</Select.Option>
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
              index === 8 ||
              index === 9 ||
              index === 10 ||
              index === 13 ||
              index === 14
            ) {
              return null;
            }
            return (
              <div key={key}>
                <DoubleInput
                  label={getFullNameFromShort(
                    key as keyof typeof luminance.light,
                  )}
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
