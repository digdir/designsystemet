import React, { useEffect, useState } from 'react';
import {
  RadioGroup,
  RadioGroupSize,
  CheckboxGroup,
} from '@digdir/design-system-react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { CodeSnippet } from '../CodeSnippet/CodeSnippet';

import classes from './Controls.module.css';

interface ControlsProps {
  component: any;
  argTypes: any;
}

const Controls = ({ component, argTypes }: ControlsProps) => {
  const [controls, setControls] = useState({});

  useEffect(() => {
    setControls({ children: 'Button' });

    Object.keys(argTypes).map((item, index) => {
      if (argTypes[item].control) {
        setControls((state) => ({
          ...state,
          [item]: argTypes[item].control.options[0],
        }));
      }
    });
  }, []);

  const onRadioChanged = (prop: string, value: string | undefined) => {
    console.log(prop, value);
    setControls({ ...controls, [prop]: value });
  };

  const getRadioOptions = (options: never[]) => {
    const arr = [];
    for (let i = 0; i < options.length; i++) {
      const item: string = options[i];
      arr.push({ label: capitalizeFirstLetter(item), value: item });
    }
    return arr;
  };

  const capitalizeFirstLetter = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className={classes.component}>
      <div className={classes.container}>
        <div className={classes.preview}>
          {React.cloneElement(React.createElement(component), controls)}
        </div>
        <div className={classes.controls}>
          {Object.keys(argTypes).map((item: any, index: number) => (
            <div
              key={index}
              className={classes.item}
            >
              {argTypes[item].control && (
                <div>
                  {argTypes[item].control.type === 'radio' && (
                    <RadioGroup
                      onChange={(value) => {
                        onRadioChanged(item, value);
                      }}
                      name='test'
                      size={RadioGroupSize.Xsmall}
                      legend={capitalizeFirstLetter(item)}
                      value={argTypes[item].control.options[0]}
                      items={getRadioOptions(argTypes[item].control.options)}
                    />
                  )}
                </div>
              )}
              {/*{item.type === 'checkbox' && (*/}
              {/*  <CheckboxGroup*/}
              {/*    legend={item.label}*/}
              {/*    compact={true}*/}
              {/*    items={item.items}*/}
              {/*  />*/}
              {/*)}*/}
            </div>
          ))}
        </div>
      </div>

      <div className={classes.code}>
        {/* eslint-disable-next-line react/no-children-prop */}
        <CodeSnippet language='javascript'>
          {reactElementToJSXString(
            React.cloneElement(React.createElement(component), controls),
          )}
        </CodeSnippet>
      </div>
    </div>
  );
};

export { Controls };
