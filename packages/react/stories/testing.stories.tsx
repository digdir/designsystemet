import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import {
  Textfield,
  Switch,
  NativeSelect,
  Button,
  Checkbox,
  Radio,
  Tag,
  type ButtonProps,
} from '../src/components';

export default {
  title: 'Testing',
} as Meta;

export const Row: StoryFn<{ size: ButtonProps['size'] }> = ({ size }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
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
        <Button size={size}>Knapp</Button>
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          alignItems: 'flex-start',
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
        <Tag
          variant='secondary'
          size={size}
        >
          Tag
        </Tag>
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
