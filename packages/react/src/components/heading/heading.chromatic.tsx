import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Heading } from '.';
import * as HeadingStories from './heading.stories';

const meta: Meta = {
  title: 'Chromatic/Heading',
  component: Heading,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(HeadingStories, meta);
