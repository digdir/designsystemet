import type { Meta, StoryFn } from '@storybook/react';
import { Suggestion } from './';
export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
} as Meta;

export const Preview: StoryFn<typeof Suggestion> = (args) => {
  return (
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
  );
};

Preview.decorators = [
  (Story) => (
    <div style={{ width: '300px', height: '600px' }}>
      <Story />
    </div>
  ),
];
