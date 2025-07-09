import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Chip } from '.';
import * as ChipStories from './chip.stories';

const meta: Meta = {
  title: 'Chromatic/Chip',
  component: Chip.Radio,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ChipStories, meta);
