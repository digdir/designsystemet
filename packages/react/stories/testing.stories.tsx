import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import {
  Textfield,
  Switch,
  NativeSelect,
  Button,
  Checkbox,
  Radio,
  type TextfieldProps,
} from '../src/components';

export default {
  title: 'Testing',
} as Meta;

export const Row: StoryFn<{ size: TextfieldProps['size'] }> = ({ size }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          border: '1px solid red',
        }}
      >
        <Textfield
          hideLabel
          label='Kontroller meg!'
          size={size}
          prefix='prefix'
          suffix='suffix'
        />
        <Switch size={size}>Switch</Switch>
        <Switch
          size={size}
          aria-label='no label switch'
        ></Switch>
        <NativeSelect size={size}>
          <option>opt1</option>
          <option>opt2</option>
          <option>opt3</option>
        </NativeSelect>
        <Button size={size}>Jeg vil ha Kake</Button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          border: '1px solid red',
          borderTop: '0',
        }}
      >
        <Radio
          value='radio'
          size={size}
        >
          Radio
        </Radio>
        <Radio
          value='radio2'
          size={size}
          aria-label='no label radio'
        ></Radio>
        <Checkbox
          value='checkbox'
          size={size}
        >
          Checkbox
        </Checkbox>
        <Checkbox
          value='checkbox2'
          size={size}
          aria-label='no label checkbox'
        ></Checkbox>
      </div>
    </>
  );
};

export const SmallRow = Row.bind({});

SmallRow.args = {
  size: 'small',
};

export const LargeRow = Row.bind({});

LargeRow.args = {
  size: 'large',
};
