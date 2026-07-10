import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Chip } from './';
import * as ChipStories from './chip.stories';

const meta = preview.meta({
  title: 'Chromatic/Chip',
  component: Chip.Radio,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(ChipStories));
