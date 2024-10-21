import type { Meta, StoryFn } from '@storybook/react';

import { Field, Fieldset, Label, Textarea, Textfield } from '../..';

type Story = StoryFn<typeof Fieldset>;

export default {
  title: 'Komponenter/Fieldset',
  component: Fieldset,
} as Meta;

export const Preview: Story = (args) => (
  <form>
    <Fieldset {...args}>
      <Textfield label='Kort beskrivelse'></Textfield>
      <Field>
        <Label>Lang beskrivelse</Label>
        <Textarea />
      </Field>
    </Fieldset>
  </form>
);

Preview.args = {
  description: 'Gi en kort beskrivelse i begge feltene',
  disabled: false,
  error: '',
  legend: 'Skriv inn dine svar',
  readOnly: false,
  hideLegend: false,
  size: 'md',
};
