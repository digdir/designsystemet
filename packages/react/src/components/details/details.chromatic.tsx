import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Details } from './';
import * as DetailsStories from './details.stories';

const meta: Meta = {
  title: 'Chromatic/Details',
  component: Details,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(DetailsStories, meta);
