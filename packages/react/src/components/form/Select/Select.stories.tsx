import type { Meta, StoryFn } from '@storybook/react';

import { Select } from './Select';

export default {
  title: 'Komponenter/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Select> = (args) => (
  <Select {...args}>
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
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
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </Select>
);

Disabled.args = {
  label: 'Velg et fjell',
  disabled: true,
};

export const WithError: StoryFn<typeof Select> = (args) => (
  <Select {...args}>
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </Select>
);

WithError.args = {
  label: 'Velg et fjell',
  error: 'Du må velge et fjell',
};

export const Multiple: StoryFn<typeof Select> = (args) => (
  <Select {...args}>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </Select>
);

Multiple.args = {
  label: 'Velg fjell',
  multiple: true,
};
