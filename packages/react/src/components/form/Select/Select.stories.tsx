import type { Meta, StoryFn } from '@storybook/react';

import { Field, Label, Select, ValidationMessage } from '../../';

export default {
  title: 'Komponenter/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: StoryFn<typeof Select> = (args) => (
  <Field>
    <Label>Velg et fjell</Label>
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
  </Field>
);

Preview.args = {
  'aria-invalid': false,
  'data-size': 'md',
  disabled: false,
  readOnly: false,
};

export const Disabled: StoryFn<typeof Select> = (args) => (
  <Field>
    <Label>Velg et fjell</Label>
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
  </Field>
);

Disabled.args = {
  disabled: true,
};

export const WithError: StoryFn<typeof Select> = (args) => (
  <Field>
    <Label>Velg et fjell</Label>
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
    <ValidationMessage>Velg et fjell</ValidationMessage>
  </Field>
);

WithError.args = {
  'aria-invalid': true,
};

export const WithOptgroup: StoryFn<typeof Select> = (args) => (
  <Field>
    <Label>Velg et fjell</Label>
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
  </Field>
);
