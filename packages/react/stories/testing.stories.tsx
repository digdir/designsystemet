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
  Chip,
} from '../src/components';

export default {
  title: 'Testing',
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 'var(--ds-spacing-4)',
          background: 'var(--ds-color-neutral-background-default)',
          borderRadius: 'var(--ds-border-radius-md)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as Meta;

export const MediumRow: StoryFn<{
  size: 'sm' | 'md' | 'lg';
  direction: 'column' | 'row';
}> = ({ size, direction = 'row' }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
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

        <NativeSelect size={size}>
          <option>opt1</option>
          <option>opt2</option>
          <option>opt3</option>
        </NativeSelect>
        <Button size={size}>Knapp</Button>
        <Combobox size={size}>
          <Combobox.Option value='sogndal'>Sogndal</Combobox.Option>
          <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
        </Combobox>
      </div>
      <br />
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          background: 'rgba(255 0 0/0.3)',
          alignItems: 'flex-start',
          flexDirection: direction,
        }}
      >
        <Switch size={size}>Switch</Switch>
        <Switch size={size} aria-label='no label switch'></Switch>
        <Chip.Toggle>Toggle</Chip.Toggle>
        <Chip.Removable>Removable</Chip.Removable>
        <Tag size={size}>Tag</Tag>

        <Radio value='radio' size={size}>
          Radio
        </Radio>
        <Radio value='radio2' size={size} aria-label='no label radio'></Radio>
        <Checkbox value='checkbox' size={size}>
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

export const SmallRow = MediumRow.bind({});

SmallRow.args = {
  size: 'sm',
};

export const LargeRow = MediumRow.bind({});

LargeRow.args = {
  size: 'lg',
};

export const SmallCol = MediumRow.bind({});

SmallCol.args = {
  size: 'sm',
  direction: 'column',
};
export const MediumCol = MediumRow.bind({});

MediumCol.args = {
  size: 'md',
  direction: 'column',
};

export const LargeCol = MediumRow.bind({});

LargeCol.args = {
  size: 'lg',
  direction: 'column',
};
