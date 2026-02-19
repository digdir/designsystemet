import type { Meta, StoryFn } from '@storybook/react-vite';

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
    <Select {...args} defaultValue=''>
      <Select.Option value='' disabled>
        Velg et fjell &hellip;
      </Select.Option>
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
  width: 'full',
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

export const ReadOnly: StoryFn<typeof Select> = (args) => (
  <Field>
    <Label>Kommune</Label>
    <Select {...args}>
      <Select.Option value='blank'>Velg &hellip;</Select.Option>
      <Select.Option value='sogndal'>Sogndal</Select.Option>
    </Select>
  </Field>
);

ReadOnly.args = {
  'aria-readonly': true,
  value: 'sogndal',
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
    <Label>Velg en park</Label>
    <Select {...args}>
      <Select.Optgroup label='Grünerløkka'>
        <Select.Option value='sofienbergparken'>Sofienbergparken</Select.Option>
        <Select.Option value='birkelunden'>Birkelunden</Select.Option>
        <Select.Option value='olafryesplass'>Olaf Ryes plass</Select.Option>
      </Select.Optgroup>
      <Select.Optgroup label='Sentrum'>
        <Select.Option value='slottsparken'>Slottsparken</Select.Option>
        <Select.Option value='studenterlunden'>Studenterlunden</Select.Option>
      </Select.Optgroup>
      <Select.Optgroup label='Gamle Oslo'>
        <Select.Option value='botsparken'>Botsparken</Select.Option>
        <Select.Option value='klosterenga'>Klosterenga park</Select.Option>
      </Select.Optgroup>
    </Select>
  </Field>
);
