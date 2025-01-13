import { Heading } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { DoubleInput } from '../DoubleInput/DoubleInput';
import { useDebugStore } from '../debugStore';
import classes from './Sidebar.module.css';

export const Sidebar = () => {
  const [valueOne, setValueOne] = useState('0.24');
  const [valueTwo, setValueTwo] = useState('0.254');
  const luminance = useDebugStore((state) => state.luminance);

  return (
    <div className={classes.sidebar}>
      <Heading data-size='2xs'>Luminance values</Heading>
      <div className={classes.lum}>
        {Object.keys(luminance.light).map((key) => {
          if (luminance.light[key as keyof typeof luminance.light] === 1) {
            return null;
          }
          return (
            <div key={key}>
              <DoubleInput
                key={key}
                label={key as keyof typeof luminance.light}
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
  );
};
