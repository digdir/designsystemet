import { Field, Heading, Select } from '@digdir/designsystemet-react';
import type { InterpolationMode } from 'chroma-js';

import { DoubleInput } from '../DoubleInput/DoubleInput';
import { useDebugStore } from '../debugStore';
import { getFullNameFromShort } from '../logic/utils';
import classes from './Sidebar.module.css';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

export const Sidebar = () => {
  const luminance = useDebugStore((state) => state.luminance);

  const setInterpolationMode = useDebugStore(
    (state) => state.setInterpolationMode,
  );
  const baseModifier = useDebugStore((state) => state.baseModifier);
  const setBaseModifier = useDebugStore((state) => state.setBaseModifier);
  const STEP = 0.2;
  const MIN = 0;
  const MAX = 100;
  const COLORS = ['red', 'black', 'red', 'black'];
  const [values, setValues] = useState([30, 45, 69]);
  return (
    <div className={classes.sidebar}>
      <div>
        <Heading className={classes.heading} data-size='2xs'>
          Base colors
        </Heading>
        <div>Negative modifier luminance range</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => setValues(values)}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '36px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '5px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values,
                      colors: COLORS,
                      min: MIN,
                      max: MAX,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged, index }) => (
              <div
                {...props}
                key={props.key}
                style={{
                  ...props.style,
                  height: '22px',
                  width: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 2px 6px #AAA',
                }}
              ></div>
            )}
          />
          <div className={classes.rangeOutput}>
            <div className={classes.rangeOutputItem}>
              {values[0].toFixed(1)}
            </div>
            <div className={classes.rangeOutputItem}>
              {values[1].toFixed(1)}
            </div>
            <div className={classes.rangeOutputItem}>
              {values[2].toFixed(1)}
            </div>
          </div>
        </div>
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
          {Object.keys(luminance.light).map((key) => {
            if (luminance.light[key as keyof typeof luminance.light] === 1) {
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
