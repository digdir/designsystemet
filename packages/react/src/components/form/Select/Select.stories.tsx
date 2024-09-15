import type { Meta, StoryFn } from '@storybook/react';

import { Select } from './';

export default {
  title: 'Komponenter/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Select> = (args) => (
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
);

Preview.args = {
  label: 'Velg et fjell',
  size: 'md',
  disabled: false,
  readOnly: false,
};

export const Disabled: StoryFn<typeof Select> = (args) => (
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
);

Disabled.args = {
  label: 'Velg et fjell',
  disabled: true,
};

export const WithError: StoryFn<typeof Select> = (args) => (
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
);

WithError.args = {
  label: 'Velg et fjell',
  error: 'Du må velge et fjell',
};

export const Multiple: StoryFn<typeof Select> = (args) => (
  <Select {...args}>
    <Select.Option value='everest'>Mount Everest</Select.Option>
    <Select.Option value='aconcagua'>Aconcagua</Select.Option>
    <Select.Option value='denali'>Denali</Select.Option>
    <Select.Option value='kilimanjaro'>Kilimanjaro</Select.Option>
    <Select.Option value='elbrus'>Elbrus</Select.Option>
    <Select.Option value='vinson'>Mount Vinson</Select.Option>
    <Select.Option value='puncakjaya'>Puncak Jaya</Select.Option>
    <Select.Option value='kosciuszko'>Mount Kosciuszko</Select.Option>
  </Select>
);

Multiple.args = {
  label: 'Velg fjell',
  multiple: true,
};
