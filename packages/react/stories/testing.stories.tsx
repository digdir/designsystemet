import type { Meta, StoryFn } from '@storybook/react';

import {
  Textfield,
  Switch,
  NativeSelect,
  Button,
  Checkbox,
  Radio,
  Tag,
  Combobox,
  type ButtonProps,
} from '../src/components';

export default {
  title: 'Testing',
} as Meta;

export const MediumRow: StoryFn<{
  size: ButtonProps['size'];
  direction: 'column' | 'row';
}> = ({ size, direction = 'row' }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          flexDirection: direction,
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
        <Combobox size={size}>
          <Combobox.Option value='sogndal'>Sogndal</Combobox.Option>
        </Combobox>
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          alignItems: 'flex-start',
          flexDirection: direction,
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
        <Tag size={size}>Tag</Tag>
      </div>
    </>
  );
};

export const SmallRow = MediumRow.bind({});

SmallRow.args = {
  size: 'small',
};

export const LargeRow = MediumRow.bind({});

LargeRow.args = {
  size: 'large',
};

export const SmallCol = MediumRow.bind({});

SmallCol.args = {
  size: 'small',
  direction: 'column',
};
export const MediumCol = MediumRow.bind({});

MediumCol.args = {
  size: 'medium',
  direction: 'column',
};

export const LargeCol = MediumRow.bind({});

LargeCol.args = {
  size: 'large',
  direction: 'column',
};
