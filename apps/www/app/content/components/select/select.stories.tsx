import { Field, Label, Select } from '@digdir/designsystemet-react';

export const Preview = () => (
  <Field>
    <Label>Velg et fjell</Label>
    <Select defaultValue=''>
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

export const Disabled = () => (
  <Field>
    <Label>Velg et fjell</Label>
    <Select disabled>
      <Select.Option value='blank'>Velg &hellip;</Select.Option>
      <Select.Option value='everest'>Mount Everest</Select.Option>
    </Select>
  </Field>
);

export const ReadOnly = () => (
  <Field>
    <Label>Velg et fjell</Label>
    <Select readOnly value='everest'>
      <Select.Option value='everest'>Mount Everest</Select.Option>
    </Select>
  </Field>
);
