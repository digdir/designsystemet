import type { Meta, StoryFn } from '@storybook/react';

import {
  Button,
  Checkbox,
  Chip,
  Combobox,
  Radio,
  Select,
  Switch,
  Tag,
  Textfield,
} from '../src/components';

export default {
  title: 'Testing',
  parameters: {
    a11y: {
      /*
      These stories only exist to test sizing/alignment, so we don't want to
      do the work to add correct aria attributes.
      */
      disable: true,
    },
    customStyles: {
      padding: 'var(--ds-spacing-4)',
      background: 'var(--ds-color-neutral-background-default)',
      borderRadius: 'var(--ds-border-radius-md)',
    },
  },
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

        <Select size={size}>
          <Select.Option>opt1</Select.Option>
          <Select.Option>opt2</Select.Option>
          <Select.Option>opt3</Select.Option>
        </Select>
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
        <Chip.Checkbox>Toggle</Chip.Checkbox>
        <Chip.Removable>Removable</Chip.Removable>
        <Tag size={size}>Tag</Tag>

        <Radio label='Radio' value='radio' size={size} />
        <Radio value='radio2' size={size} aria-label='no label radio'></Radio>
        <Checkbox label='Checkbox' value='checkbox' size={size} />
        <Checkbox
          value='checkbox2'
          size={size}
          aria-label='no label checkbox'
        />
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
