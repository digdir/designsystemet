import preview from '../../../../../apps/storybook/.storybook/preview';

import { Field, Label, Select, ValidationMessage } from '../../';

const meta = preview.meta({
  title: 'Komponenter/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
});

export const Preview = meta.story({
  render: (args) => (
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
  ),

  args: {
    'aria-invalid': false,
    width: 'full',
    disabled: false,
    readOnly: false,
  },
});

export const Disabled = meta.story({
  render: (args) => (
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
  ),

  args: {
    disabled: true,
  },
});

export const ReadOnly = meta.story({
  render: (args) => (
    <Field>
      <Label>Kommune</Label>
      <Select {...args}>
        <Select.Option value='blank'>Velg &hellip;</Select.Option>
        <Select.Option value='sogndal'>Sogndal</Select.Option>
      </Select>
    </Field>
  ),

  args: {
    'aria-readonly': true,
    value: 'sogndal',
  },
});

export const WithError = meta.story({
  render: (args) => (
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
  ),

  args: {
    'aria-invalid': true,
  },
});

export const WithOptgroup = meta.story({
  render: (args) => (
    <Field>
      <Label>Velg en park</Label>
      <Select {...args}>
        <Select.Optgroup label='Grünerløkka'>
          <Select.Option value='sofienbergparken'>
            Sofienbergparken
          </Select.Option>
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
  ),
});
