import type { Meta, StoryFn } from '@storybook/react';
import { Field } from '../Field';
import { Label } from '../Label';
import { Suggestion } from './';
export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
} as Meta;

export const Preview: StoryFn<typeof Suggestion> = (args) => {
  return (
    <Field>
      <Label>Velg en destinasjon</Label>
      <Suggestion {...args}>
        <Suggestion.List>
          <Suggestion.Empty>Tomt</Suggestion.Empty>
          <Suggestion.Option>Option 1</Suggestion.Option>
          <Suggestion.Option>Option 2</Suggestion.Option>
          <Suggestion.Option>Option 3</Suggestion.Option>
        </Suggestion.List>
        <Suggestion.Input />
        <Suggestion.Clear />
      </Suggestion>
    </Field>
  );
};

Preview.decorators = [
  (Story) => (
    <div style={{ width: '300px', height: '600px' }}>
      <Story />
    </div>
  ),
];
