import { Field, Label, Select } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
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
};

export const Disabled = () => {
  return (
    <Field>
      <Label>Velg et fjell</Label>
      <Select disabled>
        <Select.Option value='blank'>Velg &hellip;</Select.Option>
        <Select.Option value='everest'>Mount Everest</Select.Option>
      </Select>
    </Field>
  );
};

export const ReadOnly = () => {
  return (
    <Field>
      <Label>Velg et fjell</Label>
      <Select readOnly value='everest'>
        <Select.Option value='everest'>Mount Everest</Select.Option>
      </Select>
    </Field>
  );
};

export const WithOptgroup = () => {
  return (
    <Field>
      <Label>Velg en park</Label>
      <Select>
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
  );
};
