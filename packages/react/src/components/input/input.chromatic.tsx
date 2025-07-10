import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Input } from './input';
import * as InputStories from './input.stories';

const meta: Meta = {
  title: 'Chromatic/Input',
  component: Input,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(InputStories, meta);
