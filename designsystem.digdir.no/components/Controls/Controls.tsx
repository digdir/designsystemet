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
    for (let i = 0; i < argTypes.length; i++) {
      setControls((state) => ({
        ...state,
        [argTypes[i].prop]: argTypes[i].defaultValue,
      }));
    }
  }, []);

  const onRadioChanged = (prop: string, value: string | undefined) => {
    setControls({ ...controls, [prop]: value });
  };

  return (
    <div className={classes.component}>
      <div className={classes.container}>
        <div className={classes.preview}>
          {React.cloneElement(React.createElement(component), controls)}
        </div>
        <div className={classes.controls}>
          {argTypes.map((item: any, index: number) => (
            <div
              key={index}
              className={classes.item}
            >
              {item.type === 'radio' && (
                <RadioGroup
                  onChange={(value) => {
                    onRadioChanged(item.prop, value);
                  }}
                  name='test'
                  size={RadioGroupSize.Xsmall}
                  legend={item.label}
                  value={item.defaultValue}
                  items={item.items}
                />
              )}
              {item.type === 'checkbox' && (
                <CheckboxGroup
                  legend={item.label}
                  compact={true}
                  items={item.items}
                />
              )}
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
