import type { Meta } from '@storybook/react';
import { Heading } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as HeadingStories from './Heading.stories';

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
