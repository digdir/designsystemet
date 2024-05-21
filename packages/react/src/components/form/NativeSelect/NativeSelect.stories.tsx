import type { Meta, StoryFn } from '@storybook/react';

import { NativeSelect } from './NativeSelect';

export default {
  title: 'Komponenter/NativeSelect',
  component: NativeSelect,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof NativeSelect> = (args) => (
  <NativeSelect {...args}>
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </NativeSelect>
);

Preview.args = {
  label: 'Velg et fjell',
  size: 'md',
  disabled: false,
  readOnly: false,
};

export const Disabled: StoryFn<typeof NativeSelect> = (args) => (
  <NativeSelect {...args}>
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </NativeSelect>
);

Disabled.args = {
  label: 'Velg et fjell',
  disabled: true,
};

export const Error: StoryFn<typeof NativeSelect> = (args) => (
  <NativeSelect {...args}>
    <option value='blank'>Velg &hellip;</option>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </NativeSelect>
);

Error.args = {
  label: 'Velg et fjell',
  error: 'Du må velge et fjell',
};

export const Multiple: StoryFn<typeof NativeSelect> = (args) => (
  <NativeSelect {...args}>
    <option value='everest'>Mount Everest</option>
    <option value='aconcagua'>Aconcagua</option>
    <option value='denali'>Denali</option>
    <option value='kilimanjaro'>Kilimanjaro</option>
    <option value='elbrus'>Elbrus</option>
    <option value='vinson'>Mount Vinson</option>
    <option value='puncakjaya'>Puncak Jaya</option>
    <option value='kosciuszko'>Mount Kosciuszko</option>
  </NativeSelect>
);

Multiple.args = {
  label: 'Velg fjell',
  multiple: true,
};
