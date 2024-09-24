import type { Meta, StoryFn } from '@storybook/react';

import { Textarea } from '../Textarea';
import { Textfield } from '../Textfield';

import { Field } from '.';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
} as Meta;

export const Preview: Story = (args) => (
  <Field {...args}>
    <Textfield label='Kort beskrivelse'></Textfield>
    <Textarea label='Lang beskrivelse'></Textarea>
  </Field>
);
