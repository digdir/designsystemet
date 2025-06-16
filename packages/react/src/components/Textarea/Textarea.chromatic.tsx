import type { Meta } from '@storybook/react-vite';
import { Textarea } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as TextareaStories from './Textarea.stories';

const meta: Meta = {
  title: 'Chromatic/Textarea',
  component: Textarea,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TextareaStories, meta);
