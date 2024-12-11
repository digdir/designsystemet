import type { Meta, StoryFn } from '@storybook/react';
import { Suggestion } from './Suggestion';
export default {
  title: 'Komponenter/Suggestion',
  component: Suggestion,
} as Meta;

export const Preview: StoryFn<typeof Suggestion> = (args) => {
  return <Suggestion {...args} />;
};
