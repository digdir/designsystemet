import type { Meta } from '@storybook/react';
import { Chip } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ChipStories from './Chip.stories';

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
