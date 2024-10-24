import type { Meta, StoryFn } from '@storybook/react';

import { Label } from '../../Label';
import { Select } from './';

export default {
  title: 'Komponenter/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          flexDirection: 'column',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Preview: StoryFn<typeof Select> = (args) => (
  <>
    <Label htmlFor={args.id}>Velg et fjell</Label>
    <Select {...args}>
      <Select.Option value='blank'>Velg &hellip;</Select.Option>
      <Select.Option value='everest'>Mount Everest</Select.Option>
      <Select.Option value='aconcagua'>Aconcagua</Select.Option>
      <Select.Option value='denali'>Denali</Select.Option>
      <Select.Option value='kilimanjaro'>Kilimanjaro</Select.Option>
      <Select.Option value='elbrus'>Elbrus</Select.Option>
      <Select.Option value='vinson'>Mount Vinson</Select.Option>
      <Select.Option value='puncakjaya'>Puncak Jaya</Select.Option>
      <Select.Option value='kosciuszko'>Mount Kosciuszko</Select.Option>
    </Select>
  </>
);

Preview.args = {
  'aria-invalid': false,
  'data-size': 'md',
  disabled: false,
  readOnly: false,
  id: 'my-select',
};

export const Disabled: StoryFn<typeof Select> = (args) => (
  <>
    <Label htmlFor={args.id}>Velg et fjell</Label>
    <Select {...args}>
      <Select.Option value='blank'>Velg &hellip;</Select.Option>
      <Select.Option value='everest'>Mount Everest</Select.Option>
      <Select.Option value='aconcagua'>Aconcagua</Select.Option>
      <Select.Option value='denali'>Denali</Select.Option>
      <Select.Option value='kilimanjaro'>Kilimanjaro</Select.Option>
      <Select.Option value='elbrus'>Elbrus</Select.Option>
      <Select.Option value='vinson'>Mount Vinson</Select.Option>
      <Select.Option value='puncakjaya'>Puncak Jaya</Select.Option>
      <Select.Option value='kosciuszko'>Mount Kosciuszko</Select.Option>
    </Select>
  </>
);

Disabled.args = {
  disabled: true,
  id: 'my-select',
};

export const WithError: StoryFn<typeof Select> = (args) => (
  <>
    <Label htmlFor={args.id}>Velg et fjell</Label>
    <Select {...args}>
      <Select.Option value='blank'>Velg &hellip;</Select.Option>
      <Select.Option value='everest'>Mount Everest</Select.Option>
      <Select.Option value='aconcagua'>Aconcagua</Select.Option>
      <Select.Option value='denali'>Denali</Select.Option>
      <Select.Option value='kilimanjaro'>Kilimanjaro</Select.Option>
      <Select.Option value='elbrus'>Elbrus</Select.Option>
      <Select.Option value='vinson'>Mount Vinson</Select.Option>
      <Select.Option value='puncakjaya'>Puncak Jaya</Select.Option>
      <Select.Option value='kosciuszko'>Mount Kosciuszko</Select.Option>
    </Select>
  </>
);

WithError.args = {
  'aria-invalid': true,
  id: 'my-select',
};

export const WithOptgroup: StoryFn<typeof Select> = (args) => (
  <>
    <Label htmlFor={args.id}>Velg et fjell</Label>
    <Select {...args}>
      <Select.Optgroup label='Gruppe 1'>
        <Select.Option value='everest'>Mount Everest</Select.Option>
        <Select.Option value='aconcagua'>Aconcagua</Select.Option>
        <Select.Option value='denali'>Denali</Select.Option>
        <Select.Option value='kilimanjaro'>Kilimanjaro</Select.Option>
      </Select.Optgroup>
      <Select.Optgroup label='Gruppe 2'>
        <Select.Option value='elbrus'>Elbrus</Select.Option>
        <Select.Option value='vinson'>Mount Vinson</Select.Option>
        <Select.Option value='puncakjaya'>Puncak Jaya</Select.Option>
        <Select.Option value='kosciuszko'>Mount Kosciuszko</Select.Option>
      </Select.Optgroup>
    </Select>
  </>
);

WithOptgroup.args = {
  id: 'my-select',
};
