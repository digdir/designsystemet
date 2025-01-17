import type { Meta, StoryFn } from '@storybook/react';
import { Label } from '../Label';

import {
  Field,
  Fieldset,
  Input,
  Select,
  Textarea,
  ValidationMessage,
} from '../';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
  parameters: {
    customStyles: {
      maxWidth: 600,
      width: '90vw',
    },
  },
} as Meta;

export const Preview: Story = () => {
  return (
    <Field data-my-field>
      <Label>Kort beskrivelse</Label>
      <Field.Description>Beskrivelse</Field.Description>
      <Input />
      <ValidationMessage>Feilmelding</ValidationMessage>
    </Field>
  );
};

export const Affix: Story = () => (
  <div>
    <Field>
      <Label>Hvor mange kroner koster det per måned?</Label>
      <Field.Affixes>
        <Field.Affix>NOK</Field.Affix>
        <Input />
        <Field.Affix>pr. mnd.</Field.Affix>
      </Field.Affixes>
    </Field>

    <Field>
      <Label>Hvor mange kilo veier eplene du har valgt?</Label>
      <Field.Affixes>
        <Textarea rows={2} cols={4} />
        <Field.Affix>KG</Field.Affix>
      </Field.Affixes>
    </Field>

    <Field>
      <Label>Hvor mange kroner koster det?</Label>
      <Field.Affixes>
        <Field.Affix>NOK</Field.Affix>
        <Select>
          <Select.Option value='-1'>Velg &hellip;</Select.Option>
          <Select.Option value='10'>10</Select.Option>
          <Select.Option value='20'>20</Select.Option>
          <Select.Option value='30'>30</Select.Option>
        </Select>
      </Field.Affixes>
    </Field>

    <Field>
      <Label>No affix</Label>
      <Field.Affixes>
        <Input />
      </Field.Affixes>
    </Field>

    <Field>
      <Label>No affix and small size</Label>
      <Field.Affixes>
        <Input size={10} />
      </Field.Affixes>
    </Field>

    <Field>
      <Label>No affix and huge size</Label>
      <Field.Affixes>
        <Input size={9999} />
      </Field.Affixes>
    </Field>

    <Field>
      <Label>Affix and small size</Label>
      <Field.Affixes>
        <Field.Affix>NOK</Field.Affix>
        <Input size={10} />
        <Field.Affix>pr. mnd.</Field.Affix>
      </Field.Affixes>
    </Field>

    <Field>
      <Label>Affix and huge size</Label>
      <Field.Affixes>
        <Field.Affix>NOK</Field.Affix>
        <Input size={50} />
        <Field.Affix>pr. mnd.</Field.Affix>
      </Field.Affixes>
    </Field>
  </div>
);

export const Counter: Story = () => (
  <Field>
    <Label>Legg til en beskrivelse</Label>
    <Textarea rows={2} />
    <Field.Counter limit={10} />
  </Field>
);

export const Position: Story = () => (
  <>
    <Fieldset>
      <Fieldset.Legend>Fields with position="start"</Fieldset.Legend>
      <Field position='start'>
        <Label>Radio</Label>
        <Input type='radio' />
      </Field>
      <Field position='start'>
        <Label>Checkbox</Label>
        <Input type='checkbox' />
      </Field>
      <Field position='start'>
        <Label>Switch</Label>
        <Input type='checkbox' role='switch' />
      </Field>
    </Fieldset>
    <br />
    <Fieldset>
      <Fieldset.Legend>Fields with position="end"</Fieldset.Legend>
      <Field position='end'>
        <Label>Radio</Label>
        <Input type='radio' />
      </Field>
      <Field position='end'>
        <Label>Checkbox</Label>
        <Input type='checkbox' />
      </Field>
      <Field position='end'>
        <Label>Switch</Label>
        <Input type='checkbox' role='switch' />
      </Field>
    </Fieldset>
  </>
);
