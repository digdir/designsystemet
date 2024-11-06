import type { Meta, StoryFn } from '@storybook/react';

import { Field, Fieldset, Input, Label, Textarea } from '../..';

type Story = StoryFn<typeof Fieldset>;

export default {
  title: 'Komponenter/Fieldset',
  component: Fieldset,
} as Meta;

export const Preview: Story = (args) => (
  <form>
    <Fieldset {...args}>
      <Fieldset.Legend>Skriv inn dine svar</Fieldset.Legend>
      <Fieldset.Description>
        Gi en kort beskrivelse i begge feltene
      </Fieldset.Description>
      <Field>
        <Label>Kort beskrivelse</Label>
        <Input />
      </Field>
      <Field>
        <Label>Lang beskrivelse</Label>
        <Textarea />
      </Field>
    </Fieldset>
  </form>
);
